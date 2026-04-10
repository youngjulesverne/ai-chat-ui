import { prisma } from "../../../../lib/prisma";

type Context = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: Context) {
  const { id } = await context.params;

  const existing = await prisma.conversation.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return Response.json({ error: "Conversation not found" }, { status: 404 });
  }

  await prisma.conversation.delete({
    where: { id },
  });

  return new Response(null, { status: 204 });
}