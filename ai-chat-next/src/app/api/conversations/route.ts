import {
  createConversation,
  listConversations,
} from "../../../lib/data/chat";

export async function GET() {
  const conversations = await listConversations();
  return Response.json(conversations);
}

export async function POST() {
  const conversation = await createConversation();
  return Response.json(conversation, { status: 201 });
}