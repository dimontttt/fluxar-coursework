<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useFluxarStore } from '../stores/fluxarStore'

const route = useRoute()
const store = useFluxarStore()
const added = ref(false)

onMounted(() => {
  store.loadProducts()
})

const product = computed(() => store.getProductById(route.params.id))

function handleAdd() {
  if (!product.value) return
  store.addToCart(product.value)
  added.value = true
  setTimeout(() => {
    added.value = false
  }, 1200)
}
</script>

<template>
  <section class="detail page-section">
    <div class="container">
      <RouterLink to="/catalog" class="back-link">← Повернутися до каталогу</RouterLink>

      <div v-if="store.isLoading" class="state-box">Завантаження характеристик...</div>

      <div v-else-if="!product" class="state-box">
        <h2>Товар не знайдено</h2>
        <p>Можливо, вказано некоректний ідентифікатор товару.</p>
        <RouterLink to="/catalog" class="btn btn--primary">До каталогу</RouterLink>
      </div>

      <div v-else class="detail__card">
        <div class="detail__media">
          <img :src="product.image" :alt="product.name" />
        </div>

        <div class="detail__info">
          <div class="detail__badges">
            <span class="badge badge--purple">{{ product.voltage }}V</span>
            <span class="badge badge--cyan">{{ product.color }}</span>
            <span class="badge badge--gold">{{ product.protection }}</span>
          </div>

          <h1 class="detail__title">{{ product.name }}</h1>
          <p class="detail__desc">{{ product.fullDesc }}</p>

          <ul class="specs-list">
            <li>
              <span>Робоча напруга:</span>
              <strong>{{ product.voltage }} В</strong>
            </li>
            <li>
              <span>Довжина стрічки:</span>
              <strong>{{ product.length }} м</strong>
            </li>
            <li>
              <span>Колір світіння:</span>
              <strong>{{ product.color }} ({{ product.colorTemp }})</strong>
            </li>
            <li>
              <span>Споживана потужність:</span>
              <strong>{{ product.power }}</strong>
            </li>
            <li>
              <span>Тип підключення / живлення:</span>
              <strong>{{ product.connector }}</strong>
            </li>
            <li>
              <span>Ступінь захисту:</span>
              <strong>{{ product.protection }}</strong>
            </li>
          </ul>

          <div class="detail__buy">
            <div class="detail__price">{{ product.price }} <span>грн</span></div>
            <div class="detail__btns">
              <button type="button" class="btn btn--primary" @click="handleAdd">
                {{ added ? 'Додано до кошика ✓' : 'Додати в кошик' }}
              </button>
              <RouterLink to="/custom-order" class="btn btn--gold">
                Оформити замовлення
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../assets/styles/variables' as *;

.back-link {
  display: inline-block;
  color: $accent-cyan;
  font-weight: 600;
  margin-bottom: 24px;

  &:hover {
    text-decoration: underline;
  }
}

.detail {
  &__card {
    background: $bg-card;
    border: 1px solid $border-color;
    border-radius: $radius-lg;
    padding: 28px;
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 32px;
    align-items: start;
  }

  &__media {
    background: $bg-input;
    border-radius: $radius-md;
    overflow: hidden;
    border: 1px solid $border-color;

    img {
      width: 100%;
      height: auto;
    }
  }

  &__badges {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }

  &__title {
    font-size: 1.9rem;
    margin-bottom: 14px;
  }

  &__desc {
    color: $text-muted;
    margin-bottom: 22px;
  }

  &__buy {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }

  &__price {
    font-size: 2rem;
    font-weight: 800;
    color: $accent-gold;

    span {
      font-size: 1rem;
      font-weight: 500;
    }
  }

  &__btns {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
}

.badge {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;

  &--purple {
    background: $accent-purple;
    color: #fff;
  }

  &--cyan {
    background: rgba($accent-cyan, 0.15);
    color: $accent-cyan;
    border: 1px solid rgba($accent-cyan, 0.4);
  }

  &--gold {
    background: rgba($accent-gold, 0.15);
    color: $accent-gold;
    border: 1px solid rgba($accent-gold, 0.4);
  }
}

.specs-list {
  list-style: none;
  background: $bg-input;
  border-radius: $radius-md;
  padding: 16px 20px;
  border: 1px solid $border-color;

  li {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid rgba($border-color, 0.6);

    &:last-child {
      border-bottom: none;
    }

    span {
      color: $text-muted;
    }

    strong {
      color: $text-main;
      text-align: right;
    }
  }
}

.state-box {
  background: $bg-card;
  padding: 40px;
  border-radius: $radius-lg;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

@media (max-width: 850px) {
  .detail__card {
    grid-template-columns: 1fr;
  }
}
</style>