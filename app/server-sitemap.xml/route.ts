import { getServerSideSitemap, type ISitemapField } from 'next-sitemap';
import dbConnect from '@/lib/db';
import Frame from '@/models/Frame';

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch all frames from database
    const frames = await Frame.find({ stock: { $gt: 0 } }).select('slug updatedAt').lean();
    
    // Generate sitemap fields for dynamic frame pages
    const fields: ISitemapField[] = frames.map((frame) => ({
      loc: `https://framekart.co.in/frames/${frame.slug}`,
      lastmod: frame.updatedAt ? new Date(frame.updatedAt).toISOString() : new Date().toISOString(),
      changefreq: 'weekly' as const,
      priority: 0.8,
    }));

    return getServerSideSitemap(fields);
  } catch (error) {
    console.error('Error generating server sitemap:', error);
    return getServerSideSitemap([]);
  }
}
