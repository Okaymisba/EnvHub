
export class CryptoUtils {
  // Convert string to ArrayBuffer
  private static stringToBuffer(str: string): ArrayBuffer {
    return new TextEncoder().encode(str);
  }

  // Convert ArrayBuffer to string
  private static bufferToString(buffer: ArrayBuffer): string {
    return new TextDecoder().decode(buffer);
  }

  // Convert ArrayBuffer to base64
  private static bufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(byte => binary += String.fromCharCode(byte));
    return btoa(binary);
  }

  // Convert base64 to ArrayBuffer
  private static base64ToBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Derive key from password using PBKDF2
  private static async deriveKey(password: string, salt: ArrayBuffer): Promise<CryptoKey> {
    const passwordBuffer = this.stringToBuffer(password);
    const importedKey = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      importedKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt content with AES-256-GCM
  static async encrypt(content: string, password: string): Promise<{
    ciphertext: string;
    salt: string;
    nonce: string;
    tag: string;
  }> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const nonce = crypto.getRandomValues(new Uint8Array(12));
    
    const key = await this.deriveKey(password, salt);
    const contentBuffer = this.stringToBuffer(content);
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: nonce,
        tagLength: 128
      },
      key,
      contentBuffer
    );

    // Split encrypted data and tag
    const encryptedArray = new Uint8Array(encrypted);
    const ciphertext = encryptedArray.slice(0, -16);
    const tag = encryptedArray.slice(-16);

    return {
      ciphertext: this.bufferToBase64(ciphertext),
      salt: this.bufferToBase64(salt),
      nonce: this.bufferToBase64(nonce),
      tag: this.bufferToBase64(tag)
    };
  }

  // Decrypt content with AES-256-GCM
  static async decrypt(
    encryptedData: {
      ciphertext: string;
      salt: string;
      nonce: string;
      tag: string;
    },
    password: string
  ): Promise<string> {
    const salt = this.base64ToBuffer(encryptedData.salt);
    const nonce = this.base64ToBuffer(encryptedData.nonce);
    const ciphertext = this.base64ToBuffer(encryptedData.ciphertext);
    const tag = this.base64ToBuffer(encryptedData.tag);

    // Combine ciphertext and tag
    const encryptedBuffer = new Uint8Array(ciphertext.byteLength + tag.byteLength);
    encryptedBuffer.set(new Uint8Array(ciphertext));
    encryptedBuffer.set(new Uint8Array(tag), ciphertext.byteLength);

    const key = await this.deriveKey(password, salt);
    
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: nonce,
        tagLength: 128
      },
      key,
      encryptedBuffer
    );

    return this.bufferToString(decrypted);
  }
}
