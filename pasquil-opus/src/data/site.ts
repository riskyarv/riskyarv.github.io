import type { IconName } from './icons';
import siteData from '@content/site.json';
import menu from '@content/menu.json';
import servicesData from '@content/services.json';

export const site = { ...siteData, description: siteData.seo.description };

export interface NavItem {
  label: string;
  href: string;
  icon?: IconName;
  children?: NavItem[];
}

export const sets = {
  base: '/wat-is-onze-aanpak/template-standaard-risicoset/',
  ouderenzorg: '/wat-is-onze-aanpak/template-standaard-risicoset/standaard-risicoset-ouderenzorg/',
  ziekenhuis: '/wat-is-onze-aanpak/template-standaard-risicoset/standaardsetziekenhuis/',
  hogeronderwijs: '/wat-is-onze-aanpak/template-standaard-risicoset/standaardsethogeronderwijs/',
  english: '/wat-is-onze-aanpak/template-standaard-risicoset/template-standard-risk-set/',
};

export const nav = menu.items as NavItem[];

export interface Service {
  id: string;
  title: string;
  icon: IconName;
  summary: string;
}

export const services = servicesData.items as Service[];

/** Vervangt `{naam}`-placeholders in een tekst uit de content-bestanden. */
export const fill = (tpl: string, vars: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
