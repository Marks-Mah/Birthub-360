- De: Agente 07
- Para: Agente 01
- Onda: IA-1
- Status: aberto
- Prioridade: alto

## Problema

O cliente Qdrant foi implementado para substituir embeddings locais, mas precisa de uma tabela no Prisma para rastrear metadados dos embeddings e manter paridade com o banco de dados.

## Arquivo(s) envolvido(s)

- `prisma/schema.prisma`
- `src/lib/ai/embeddings/qdrant.ts`

## Alteração necessária

Criar uma migration para adicionar a tabela `DocumentEmbedding` com o seguinte schema:

```prisma
model DocumentEmbedding {
  id          String   @id @default(cuid())
  tenantId    String
  documentId  String
  vectorId    String   // ID no Qdrant
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([tenantId, documentId])
  @@index([vectorId])
}
```

## Teste esperado

1. Migration aplicada com sucesso
2. Tabela criada com índices corretos
3. Compatibilidade com RLS multi-tenant

## Contexto adicional

A tabela é usada para:
- Rastrear quais embeddings foram upsertados no Qdrant
- Manter metadados sincronizados entre Qdrant e PostgreSQL
- Suportar deleção por tenant ou documento (GDPR/compliance)

O cliente Qdrant já está implementado em `src/lib/ai/embeddings/qdrant.ts` e espera que esta tabela exista para operações de sincronização.
