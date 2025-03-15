import { Injectable } from '@nestjs/common';
import { SecretService } from '@app/auth/secret/secret.service';

@Injectable()
export class LogoutService {
	constructor(private readonly secretService: SecretService) { }

	async logout(token: string): Promise<void> {
		return await this.secretService.destroyToken(token);
	}

	async logoutGlobally(userId: string): Promise<void> {
		return await this.secretService.destroyAllTokens(userId);
	}
}