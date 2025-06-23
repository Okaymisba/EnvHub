
export interface Project {
  id: string;
  name: string;
  created_at: string;
  user_id: string;
  password_hash?: string;
  version_count?: number;
}

export interface EnvVersion {
  id: string;
  project_id: string;
  version_number: number;
  variable_count: number;
  created_at: string;
  salt: string;
  nonce: string;
  tag: string;
}

export interface EnvVariable {
  id: string;
  project_id: string;
  version_id: string;
  env_name: string;
  env_value_encrypted: string;
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

export interface EnvEntry {
  name: string;
  value: string;
  id?: string;
}
