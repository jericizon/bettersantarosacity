import type { Law } from '~/types/civic'

// Spec §15 category labels; plural forms match the spec's category names.
export const LAW_TYPE_LABEL: Record<Law['type'], string> = {
  ordinance: 'Ordinance',
  resolution: 'Resolution',
  executive_order: 'Executive Order'
}

export const LAW_TYPE_PLURAL: Record<Law['type'], string> = {
  ordinance: 'Ordinances',
  resolution: 'Resolutions',
  executive_order: 'Executive Orders'
}

export const LAW_TYPE_BADGE: Record<Law['type'], string> = {
  ordinance: 'bg-laguna-green/10 text-laguna-green border-laguna-green/20',
  resolution: 'bg-laguna-blue/15 text-laguna-blue border-laguna-blue/30',
  executive_order: 'bg-heritage-gold/20 text-charcoal border-heritage-gold/40'
}

// Spec §22 attribution pattern: "Based on: Official Ordinance No. XXXX"
export const LAW_BASED_ON: Record<Law['type'], string> = {
  ordinance: 'Official Ordinance',
  resolution: 'Official Resolution',
  executive_order: 'Executive Order'
}
