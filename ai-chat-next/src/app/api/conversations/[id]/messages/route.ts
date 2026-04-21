import { listMessages } from "../../../../../lib/data/chat";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  const messages = await listMessages(id);

  return Response.json(messages);
}