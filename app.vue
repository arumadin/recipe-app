<template>
  <UContainer v-if="recipe" class="py-12">
    <h1 class="font-bold text-xl mb-5">
      {{ recipe.title }}
    </h1>
    <div class="flex flex-row gap-1 mt-2 flex-wrap">
      <UBadge v-for="label in recipe.dishTypes" :label="label" :variant="'subtle'"></UBadge>
    </div>
    <section class="mt-4 flex flex-col md:flex-row-reverse gap-8 w-full">
      <NuxtImg :src="recipe.image" :alt="recipe.title" class="object-cover w-full"></NuxtImg>
      <p class="text-lg md:max-w-[40ch]" v-html="recipe.summary"></p>
    </section>
    <div class="flex flex-col md:flex-row gap-2 md:gap-8">
      <section class="py-2 md:py-8 flex-shrink-0">
        <div flex flex-col md:flex-row justify-between md:items-center>
          <h2 class="text-lg">Ingredients</h2>
        </div>
        <UTable :rows="recipe.extendedIngredients" :columns="columns" class="mt-2">
          <template #name-data="{ row }">
            <span class="flex flex-row gap-2 items-center">
              <NuxtImg provider="spoonacular" :src="row.image" :alt="`image of ${row.name}`" :height="20" :width="20" />
              {{ row.name }}
              ({{ [row.measures[unit].amount, row.measures[unit].unitShort].filter(Boolean).join(' ') }})
            </span>
          </template>
        </UTable>
      </section>
      <section class="py-2 md:py-8">
        <h2 class="text-lg mb-2">Steps</h2>
        <ol>
          <li v-for="{ number, step } in recipe.analyzedInstructions?.[0].steps" class="flex items-baseline gap-2 mb-4">
            <span class="flex-shrink-0 inline-flex items-center justify-center rounded-full 
          bg-primary-50 dark:bg-primary-400 dark:bg-opacity-190 text-primary-500 dark:text-slate-700
          ring-1 ring-inset ring-primary-500 dark:ring-primary-400 ring-opacity-25 text-xs font-bold h-5 w-5">
              {{ number }}
            </span>
            {{ step }}

          </li>
        </ol>
      </section>
    </div>
    <UButton external :to="recipe.sourceUrl">
      View original recipe on {{ recipe.sourceName }}
    </UButton>
  </UContainer>
  <!-- <pre>
    {{ recipe }}
  </pre> -->
</template>

<script setup lang="ts">
import type { InternalApi } from "nitropack";
const { data: recipe } = await useFetch('/api/recipes', {
  transform: data => data[Math.random() * data.length | 0]
})
// const recipe = recipes.value![0]

const columnsToShow: Array<keyof InternalApi['/api/recipes']['get'][number]['extendedIngredients'][number]> = ['name']

const columns = columnsToShow.map(col => ({ key: col, label: 'Ingredients', class: "hidden" }))
const metric = ref(true)
const unit = computed(() => metric.value ? 'metric' : 'us')
</script>