import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import * as nodemailer from 'nodemailer';


@Injectable()
export class MailService {
   private transporter;

  create(createMailDto: CreateMailDto) {
    return 'This action adds a new mail';
  }

  findAll() {
    return `This action returns all mail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mail`;
  }

  update(id: number, updateMailDto: UpdateMailDto) {
    return `This action updates a #${id} mail`;
  }

  remove(id: number) {
    return `This action removes a #${id} mail`;
  }

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.example.com', // configure ton serveur SMTP
      port: 587,
      auth: {
        user: 'user@example.com',
        pass: 'password',
      },
    });
  }

  async sendRecommendationEmail(to: string, produit: string, argumentaire: string) {
    const html = `
      <h2>Recommandation pour vous</h2>
      <p>${argumentaire}</p>
      <p>
        <a href="https://ton-backend.com/opportunite/accept?produit=${produit}">✅ Accepter</a> |
        <a href="https://ton-backend.com/opportunite/refuse?produit=${produit}">❌ Refuser</a> |
        <a href="https://ton-backend.com/opportunite/more-info?produit=${produit}">ℹ️ Plus d'infos</a>
      </p>
    `;

    await this.transporter.sendMail({
      from: '"Assurance IA" <no-reply@assurance.com>',
      to,
      subject: `Nouvelle recommandation: ${produit}`,
      html,
    });
  }
}
