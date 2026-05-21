import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const opportunityId = searchParams.get('opportunityId');

    const contacts = await prisma.contact.findMany({
      where: opportunityId ? { opportunityId } : undefined,
      include: { opportunity: { select: { title: true } } },
      orderBy: { contactDate: 'desc' },
    });

    return Response.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return Response.json(
      { error: 'Failed to fetch contacts', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const contact = await prisma.contact.create({
      data: {
        opportunityId: body.opportunityId,
        contactName: body.contactName || body.name || 'Contact',
        organization: body.organization,
        email: body.email,
        phone: body.phone,
        role: body.role,
        notes: body.notes,
        contactDate: body.contactDate ? new Date(body.contactDate) : new Date(),
        contactMethod: body.contactMethod || 'email',
        lastAction: body.lastAction,
        nextAction: body.nextAction,
        nextActionDate: body.nextActionDate ? new Date(body.nextActionDate) : null,
        relationshipStage: body.relationshipStage || 'lead',
      },
      include: { opportunity: { select: { title: true } } },
    });

    return Response.json(contact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return Response.json(
      { error: 'Failed to create contact', details: String(error) },
      { status: 500 }
    );
  }
}
