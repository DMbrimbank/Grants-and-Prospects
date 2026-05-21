import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, organization, content } = body;

    const doc = new Document({
      sections: [
        {
          children: [
            // Title
            new Paragraph({
              text: title,
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 200 },
            }),

            // Organization
            new Paragraph({
              text: organization,
              spacing: { after: 400 },
              style: 'Heading2',
            }),

            // Logo/Branding
            new Paragraph({
              text: 'Brimbank Tech School',
              spacing: { after: 600 },
            }),

            // Proposal Content
            ...content.split('\n').map((paragraph: string) => {
              if (paragraph.trim() === '') {
                return new Paragraph({ text: '' });
              }
              return new Paragraph({
                text: paragraph,
                spacing: { after: 200 },
              });
            }),

            // Footer
            new Paragraph({
              text: '',
              spacing: { after: 400 },
            }),

            new Paragraph({
              text: 'Contact Information',
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Brimbank Tech School',
                  bold: true,
                }),
                new TextRun({
                  text: '\nEmail: brimbank.tech@vu.edu.au',
                }),
                new TextRun({
                  text: '\nWebsite: https://www.brimbanktechschool.vic.edu.au/',
                }),
              ],
              spacing: { after: 200 },
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    return new Response(buffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${title}.docx"`,
      },
    });
  } catch (error) {
    console.error('Error exporting to Word:', error);
    return Response.json(
      { error: 'Failed to export document' },
      { status: 500 }
    );
  }
}
