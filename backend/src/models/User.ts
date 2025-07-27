import DatabaseService from '../utils/database';

export interface User {
  id?: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  // Create a new user
  static async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [
      userData.email,
      userData.password_hash,
      userData.first_name,
      userData.last_name
    ];

    const result = await DatabaseService.query(query, values);
    return result.rows[0];
  }

  // Find user by email
  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await DatabaseService.query(query, [email]);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  // Find user by ID
  static async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await DatabaseService.query(query, [id]);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  // Update user
  static async update(id: number, userData: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): Promise<User | null> {
    const fields = Object.keys(userData).filter(key => userData[key as keyof typeof userData] !== undefined);
    const values: any[] = fields.map(field => userData[field as keyof typeof userData]);
    
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `
      UPDATE users 
      SET ${setClause}
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;

    values.push(id);
    const result = await DatabaseService.query(query, values);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  // Delete user
  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await DatabaseService.query(query, [id]);
    
    return result.rowCount > 0;
  }

  // Get all users (with pagination)
  static async findAll(limit: number = 10, offset: number = 0): Promise<User[]> {
    const query = `
      SELECT * FROM users 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    
    const result = await DatabaseService.query(query, [limit, offset]);
    return result.rows;
  }
}

export default UserModel;
