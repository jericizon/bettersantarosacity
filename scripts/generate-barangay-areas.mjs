// Generates data/barangay-areas.json: Voronoi cells for each barangay
// centroid, clipped to the real Santa Rosa city boundary (OSM relation 1335521).
// Cells are coverage approximations for map display — NOT cadastral boundaries.
// sync-public-data.mjs mirrors it to public/data/ at build time.
// Run: node scripts/generate-barangay-areas.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { Delaunay } from 'd3-delaunay'
import pc from 'polygon-clipping'

const centroids = JSON.parse(readFileSync('data/barangay-centroids.json', 'utf8')).barangays
const boundary = JSON.parse(readFileSync('scripts/data/city-boundary.geojson', 'utf8'))

// polygon-clipping wants GeoJSON coordinate arrays; Polygon = [rings]
const cityGeom = boundary.type === 'Polygon' ? [boundary.coordinates] : boundary.coordinates

const slugs = Object.keys(centroids)
const points = slugs.map(s => [centroids[s].lon, centroids[s].lat])

// Pad the Voronoi frame well past the city so every cell covers its share of
// the boundary; clipping trims the excess.
const lons = points.map(p => p[0]); const lats = points.map(p => p[1])
const pad = 0.05
const voronoi = Delaunay.from(points).voronoi([
  Math.min(...lons) - pad, Math.min(...lats) - pad,
  Math.max(...lons) + pad, Math.max(...lats) + pad
])

const round = n => Math.round(n * 1e6) / 1e6
const roundRing = ring => ring.map(([x, y]) => [round(x), round(y)])

const features = []
for (let i = 0; i < slugs.length; i++) {
  const cell = voronoi.cellPolygon(i)
  if (!cell) continue
  const clipped = pc.intersection(cityGeom, [[cell.map(p => [p[0], p[1]])]])
  if (!clipped || clipped.length === 0) {
    console.warn(`no overlap for ${slugs[i]}`)
    continue
  }
  features.push({
    type: 'Feature',
    geometry: clipped.length === 1
      ? { type: 'Polygon', coordinates: clipped[0].map(roundRing) }
      : { type: 'MultiPolygon', coordinates: clipped.map(poly => poly.map(roundRing)) },
    properties: { slug: slugs[i], name: centroids[slugs[i]].name, group: centroids[slugs[i]].group }
  })
}

const out = {
  _source: 'Coverage cells approximated via Voronoi tessellation of OSM community centroids, clipped to Santa Rosa city boundary (OSM relation 1335521). Not official cadastral boundaries. ODbL 1.0',
  type: 'FeatureCollection',
  features
}
writeFileSync('data/barangay-areas.json', JSON.stringify(out))
console.log(`wrote ${features.length} area features`)
