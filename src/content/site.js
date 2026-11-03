// Site-wide constants: public URL, organisation, contact details.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://anowarhdesign.github.io/quantiify-website/');
export const SITE_NAME = 'Quantiify';
export const OG_SITE_NAME = 'Quantiify by Conneqted Agents';
export const DEFAULT_OG_IMAGE = 'assets/og-image.jpg';

export const CONTACT = {
  email: 'info@quantiify.ai',
  support: 'support@conneqtedagents.ai',
  phone: '+1 (408) 500-5613',
  tel: '+14085005613',
  street: '6412 Spring Meadow Ct',
  city: 'San Jose, CA, USA',
};

// Request-a-call form: FormSubmit relays the JSON post to info@quantiify.ai
export const FORM_ENDPOINT = 'https://formsubmit.co/ajax/info@quantiify.ai';

export const ORG = {
  '@type': 'Organization', '@id': SITE_URL + '#org', name: 'Conneqted Agents', url: 'https://conneqtedagents.ai/',
  logo: SITE_URL + 'assets/conneqted-logo-dark.svg', email: 'support@conneqtedagents.ai', telephone: '+1-408-500-5613',
  address: { '@type': 'PostalAddress', streetAddress: '6412 Spring Meadow Ct', addressLocality: 'San Jose', addressRegion: 'CA', addressCountry: 'US' },
};

/** URL of a file in public/assets, respecting Vite's base path. */
export const asset = p => import.meta.env.BASE_URL + 'assets/' + p;
