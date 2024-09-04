import * as z from 'valibot'

const recipeSchema = z.object({
    id: z.number(),
    title: z.string(),
    readyInMinutes: z.number(),
    servings: z.number(),
    sourceUrl: z.string(),
    sourceName: z.string(),
    image: z.optional(z.string()),
    summary: z.string(),
    instructions: z.string(),
    dishTypes: z.array(z.string()),
    extendedIngredients: z.array(z.object({
        name: z.string(),
        amount: z.number(),
        unit: z.string(),
        image: z.nullable(z.string()),
        measures: z.object({
            us: z.object({
                amount: z.number(),
                unitShort: z.string()
            }),
            metric: z.object({
                amount: z.number(),
                unitShort: z.string()
            })
        })
    })),
    analyzedInstructions: z.array(z.object({
        steps: z.array(z.object({
            number: z.number(),
            step: z.string()
        }))
    }))

})

export default defineCachedEventHandler(async event => {
    console.log('making new recipes')
    const { recipes } = await $fetch<{recipes : unknown}>('https://api.spoonacular.com/recipes/random', 
        {
            query: {
                limitLicense: true,
                number: 100,
                apiKey: useRuntimeConfig().spoonacular.apiKey
            }
        }
    )
    // return recipes

    try {
        return (z.parse(z.array(recipeSchema), recipes))
    } catch (e:any) {
        console.log(e.issues.map((i:any) => i.path))
        console.log('error')
        return []
    }

    // return (z.parse(z.array(recipeSchema), recipes))

}, {
   base: 'recipes',
   getKey: () => 'recipes',
   shouldBypassCache: () => false,
   maxAge: 1000 * 60 * 60 * 24,
   staleMaxAge: 1000 * 60 * 60 * 24 * 7
})