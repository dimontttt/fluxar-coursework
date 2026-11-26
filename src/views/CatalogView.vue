<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFluxarStore } from '../stores/fluxarStore'
import ProductCard from '../components/ProductCard.vue'

const store = useFluxarStore()

const searchColor = ref('')
const selectedLength = ref('all')
const sortOrder = ref('default')

const lengthOptions = ['all', 1.5, 2, 2.5, 3, 4, 5, 10]

onMounted(() => {
  store.loadProducts()
})

const filteredProducts = computed(() => {
  let list = [...store.products]

  // Пошук за кольором світіння
  const query = searchColor.value.trim().toLowerCase()
  if (query) {
    list = list.filter((item) =>
      item.color.toLowerCase().includes(query)
    )
  }

  // Фільтр за довжиною стрічки (м)
  if (selectedLength.value !== 'all') {
    list = list.filter((item) => item.length === Number(selectedLength.value))
  }

  // Сортування за ціною
  if (sortOrder.value === 'asc') {
    list.sort((a, b) => a.price - b.price)
  } else if (sortOrder.value === 'desc') {
    list.sort((a, b) => b.price - a.price)
  }

  return list
})

function resetFilters() {
  searchColor.value = ''
  selectedLength.value = 'all'
  sortOrder.value = 'default'
}
</script>

<template>
  <section class="catalog page-section">
    <div class="container">
      <h1 class="section-title">Каталог світлодіодних стрічок <span>FLUXAR</span></h1>

      <!-- Панель пошуку, фільтрації та сортування -->
      <div class="controls">
        <div class="controls__group">
          <label for="color-search">Пошук за кольором світіння:</label>
          <input
            id="color-search"
            v-model="searchColor"
            type="text"
            placeholder="Наприклад: теплий, холодний, блакитний, фіолетовий..."
          />
        </div>

        <div class="controls__group">
          <label>Довжина стрічки (м):</label>
          <div class="length-tabs" role="group" aria-label="Фільтр за довжиною">
            <button
              v-for="len in lengthOptions"
              :key="len"
              type="button"
              class="length-btn"
              :class="{ active: selectedLength === len }"
              @click="selectedLength = len"
            >
              {{ len === 'all' ? 'Усі' : `${len} м` }}
            </button>
          </div>
        </div>

        <div class="controls__group">
          <label for="price-sort">Сортування за ціною:</label>
          <select id="price-sort" v-model="sortOrder">
            <option value="default">За замовчуванням</option>
            <option value="asc">Від дешевших до дорожчих</option>
            <option value="desc">Від дорожчих до дешевших</option>
          </select>
        </div>
      </div>

      <!-- Стан завантаження (Loading) -->
      <div v-if="store.isLoading" class="state-box">
        <div class="loader"></div>
        <p>Завантаження асортименту світлодіодних стрічок...</p>
      </div>

      <!-- Стан помилки (Error) -->
      <div v-else-if="store.error" class="state-box state-box--error">
        <p>{{ store.error }}</p>
        <button type="button" class="btn btn--primary" @click="store.loadProducts()">
          Спробувати ще раз
        </button>
      </div>

      <!-- Порожній результат (Empty) -->
      <div v-else-if="filteredProducts.length === 0" class="state-box">
        <p>За вашим запитом стрічок не знайдено. Спробуйте інший колір або скиньте фільтри.</p>
        <button type="button" class="btn btn--outline" @click="resetFilters">
          Скинути фільтри
        </button>
      </div>

      <!-- Сітка товарів -->
      <div v-else>
        <p class="results-count">Знайдено моделей: <strong>{{ filteredProducts.length }}</strong></p>
        <div class="products-grid">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../assets/styles/variables' as *;

.controls {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: 20px;
  margin-bottom: 28px;
  display: grid;
  grid-template-columns: 1.2fr 1.6fr 1fr;
  gap: 18px;
  align-items: end;

  &__group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-size: 0.88rem;
      font-weight: 600;
      color: $text-muted;
    }

    input,
    select {
      background: $bg-input;
      border: 1px solid $border-color;
      color: $text-main;
      padding: 10px 14px;
      border-radius: $radius-md;
      font-size: 0.95rem;
      width: 100%;

      &:focus {
        border-color: $accent-cyan;
      }
    }
  }
}

.length-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.length-btn {
  background: $bg-input;
  border: 1px solid $border-color;
  color: $text-muted;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all $transition;

  &:hover {
    border-color: $accent-cyan;
    color: $text-main;
  }

  &.active {
    background: $accent-purple;
    border-color: $accent-cyan;
    color: #fff;
  }
}

.results-count {
  color: $text-muted;
  margin-bottom: 16px;
  font-size: 0.95rem;

  strong {
    color: $accent-gold;
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 22px;
}

.state-box {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: 40px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: $text-muted;

  &--error {
    border-color: $danger;
    color: $danger;
  }
}

.loader {
  width: 38px;
  height: 38px;
  border: 3px solid $border-color;
  border-top-color: $accent-cyan;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 960px) {
  .controls {
    grid-template-columns: 1fr;
  }
}
</style>