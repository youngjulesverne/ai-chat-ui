import { deleteConversation } from "../../../../lib/data/chat";

type Context = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: Context) {
  const { id } = await context.params;

  const deleted = await deleteConversation(id);

  if (!deleted) {
    return Response.json({ error: "Conversation not found" }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}