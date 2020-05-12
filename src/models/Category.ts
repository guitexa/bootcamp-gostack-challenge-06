import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  // OneToMany,
} from 'typeorm';
// import Transaction from './Transaction';

@Entity('categories')
class Category {
  // @OneToMany(() => Transaction, transaction => transaction.category)
  // transactions: Transaction;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Category;
