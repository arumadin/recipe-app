import { joinURL } from 'ufo'
import type { ProviderGetImage } from '@nuxt/image'

export const getImage: ProviderGetImage = (
  src,
  { modifiers = {}, baseURL = 'https://img.spoonacular.com/' } = {}
) => {

  const sizes = [100, 250, 500]
  const size = modifiers.width || modifiers.height
  const nextBiggest = sizes.find((s) => s >= size!) || sizes[sizes.length - 1] 
  const prefix = `ingredients_${nextBiggest}x${nextBiggest}`

  return {
    url: joinURL(baseURL, prefix, src),
  }
}
