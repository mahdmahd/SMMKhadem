/**
 * Portfolio data — STUB.
 *
 * Task 3 replaces this file with the real content model (tagline, location,
 * email, toolkit rows, research areas, verified channel URLs, …). The shapes
 * here are deliberately minimal; the import contract is what matters:
 *
 *   import { profile, channels, nav } from '../data/portfolio'
 */

export type Profile = {
  name: string
  title: string
}

export type Channel = {
  name: string
  url: string
}

export type NavItem = {
  label: string
  href: string
}

export const profile: Profile = {
  name: 'Mohammad Mahdi Khadem',
  title: 'M.D. · AI Researcher',
}

export const channels: Channel[] = []

export const nav: NavItem[] = [
  { label: 'Research', href: '#research' },
  { label: 'Projects', href: '#projects' },
  { label: 'Publications', href: '#publications' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
]
