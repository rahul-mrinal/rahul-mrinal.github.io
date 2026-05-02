import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  publishDate?: string;
  modifiedDate?: string;
  jsonLd?: object | object[];
}

const BASE_URL = 'https://rahul-mrinal.github.io';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

function setMeta(selector: string, attr: string, value: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    const [attrName, attrValue] = attr.split('=');
    el.setAttribute(attrName, attrValue.replace(/"/g, ''));
    document.head.appendChild(el);
  }
  el.content = value;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function setJsonLd(data: object | object[]) {
  const existing = document.querySelectorAll('script[data-seo="true"]');
  existing.forEach(el => el.remove());

  const schemas = Array.isArray(data) ? data : [data];
  schemas.forEach(schema => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'true');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
}

export function usePageMeta({
  title,
  description,
  keywords,
  canonical,
  ogType = 'website',
  ogTitle,
  ogDescription,
  ogImage,
  publishDate,
  modifiedDate,
  jsonLd,
}: PageMetaProps) {
  useEffect(() => {
    document.title = title;

    const resolvedOgTitle = ogTitle ?? title;
    const resolvedOgDesc = ogDescription ?? description;
    const resolvedImage = ogImage ?? DEFAULT_IMAGE;
    const resolvedCanonical = canonical ?? (BASE_URL + window.location.pathname);

    setMeta('meta[name="description"]', 'name="description"', description);

    if (keywords) {
      setMeta('meta[name="keywords"]', 'name="keywords"', keywords);
    }

    setLink('canonical', resolvedCanonical);

    setMeta('meta[property="og:title"]', 'property="og:title"', resolvedOgTitle);
    setMeta('meta[property="og:description"]', 'property="og:description"', resolvedOgDesc);
    setMeta('meta[property="og:type"]', 'property="og:type"', ogType);
    setMeta('meta[property="og:url"]', 'property="og:url"', resolvedCanonical);
    setMeta('meta[property="og:image"]', 'property="og:image"', resolvedImage);

    setMeta('meta[name="twitter:title"]', 'name="twitter:title"', resolvedOgTitle);
    setMeta('meta[name="twitter:description"]', 'name="twitter:description"', resolvedOgDesc);
    setMeta('meta[name="twitter:image"]', 'name="twitter:image"', resolvedImage);

    if (publishDate) {
      setMeta('meta[property="article:published_time"]', 'property="article:published_time"', publishDate);
    }
    if (modifiedDate) {
      setMeta('meta[property="article:modified_time"]', 'property="article:modified_time"', modifiedDate);
    }

    if (jsonLd) {
      setJsonLd(jsonLd);
    }

    return () => {
      document.querySelectorAll('script[data-seo="true"]').forEach(el => el.remove());
    };
  }, [title, description, keywords, canonical, ogType, ogTitle, ogDescription, ogImage, publishDate, modifiedDate, jsonLd]);
}
