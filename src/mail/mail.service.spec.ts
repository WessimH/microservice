import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { CreateMailDto } from './dto/create-mail.dto';
import { validate } from 'class-validator';

// On "mock" API Resend pour que les tests ne consomment pas ton vrai quota de mails
const mockSend = jest.fn();
jest.mock('resend', () => {
    return {
        Resend: jest.fn().mockImplementation(() => ({
            emails: { send: mockSend },
        })),
    };
});

describe('MailService et Validation', () => {
    let service: MailService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MailService,
                {
                    // On simule le ConfigService pour qu'il trouve une fausse clé d'API lors du test
                    provide: ConfigService,
                    useValue: { get: jest.fn().mockReturnValue('fake-api-key') },
                },
            ],
        }).compile();

        service = module.get<MailService>(MailService);
        mockSend.mockClear();
    });

    // Test 1 : L'email s'est bien envoyé (Test type E2E/Intégration)
    it('devrait simuler l\'envoi d\'un email avec succès', async () => {
        mockSend.mockResolvedValue({ id: '12345' }); // On simule la réponse de Resend

        const result = await service.sendEmail('test@test.com', 'Sujet', '<p>Contenu</p>');

        expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
            to: 'test@test.com',
            html: '<p>Contenu</p>'
        }));
        expect(result).toEqual({ id: '12345' });
    });

    // Test 2 : Erreur s'il n'y a pas d'adresse email
    it('devrait déclencher une erreur si l\'email est manquant', async () => {
        const dto = new CreateMailDto();
        dto.html = '<p>Mon super contenu</p>'; // On met le html, mais on oublie l'email

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toEqual('email'); // L'erreur vient bien du champ "email"
    });

    // Test 3 : Erreur s'il n'y a pas de contenu dans le mail
    it('devrait déclencher une erreur si le contenu html est manquant', async () => {
        const dto = new CreateMailDto();
        dto.email = 'test@test.com'; // On met l'email, mais on oublie le html

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toEqual('html'); // L'erreur vient bien du champ "html"
    });
});