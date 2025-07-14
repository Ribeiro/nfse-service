import { z } from 'zod';

export const envSchema = z.object({
  FOCUS_BASE_URL: z.string().url(),
  FOCUS_CNPJ: z.string().length(14, 'CNPJ deve conter 14 dígitos'),
  FOCUS_TOKEN: z.string().min(1, 'Token não pode estar vazio'),
});

export type EnvVars = z.infer<typeof envSchema>;

export const validateEnv = (config: Record<string, unknown>): EnvVars => {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    console.error('Falha ao validar variáveis de ambiente:');

    for (const issue of result.error.issues) {
      const path = issue.path.join('.') || '(desconhecido)';
      console.error(`- ${path}: ${issue.message}`);
    }

    process.exit(1);
  }

  return result.data;
};
