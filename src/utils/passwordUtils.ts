// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.


export class PasswordUtils {
  // Hash password using PBKDF2 for storage
  static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    const key = await crypto.subtle.importKey(
      'raw',
      data,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    
    const bits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      key,
      256
    );
    
    // Combine salt and hash for storage
    const combined = new Uint8Array(salt.length + bits.byteLength);
    combined.set(salt);
    combined.set(new Uint8Array(bits), salt.length);
    
    return this.bufferToBase64(combined.buffer);
  }
  
  // Verify password against stored hash
  static async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    try {
      const combined = this.base64ToBuffer(storedHash);
      const salt = combined.slice(0, 16);
      const storedBits = combined.slice(16);
      
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      
      const key = await crypto.subtle.importKey(
        'raw',
        data,
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      );
      
      const bits = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        key,
        256
      );
      
      // Compare the bits
      const computedBits = new Uint8Array(bits);
      const storedBitsArray = new Uint8Array(storedBits);
      
      if (computedBits.length !== storedBitsArray.length) return false;
      
      for (let i = 0; i < computedBits.length; i++) {
        if (computedBits[i] !== storedBitsArray[i]) return false;
      }
      
      return true;
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }
  
  private static bufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(byte => binary += String.fromCharCode(byte));
    return btoa(binary);
  }
  
  private static base64ToBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
