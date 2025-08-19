import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  canonicalPath?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, canonicalPath }) => {
  const canonical = canonicalPath || window.location.pathname;
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      {description && (
        <meta property="og:description" content={description} />
      )}
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default SEO;
