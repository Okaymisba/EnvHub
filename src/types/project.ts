
export interface Project {
  id: string;
  name: string;
  created_at: string;
  user_id: string;
  version_count?: number;
}

export interface EnvVersion {
  id: string;
  project_id: string;
  version_number: number;
  encrypted_data: string;
  salt: string;
  nonce: string;
  tag: string;
  created_at: string;
}

export interface EncryptedPayload {
  ciphertext: string;
  salt: string;
  nonce: string;
  tag: string;
}
