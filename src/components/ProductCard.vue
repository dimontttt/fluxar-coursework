<script setup>
import { ref } from 'vue'
import { useFluxarStore } from '../stores/fluxarStore'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const store = useFluxarStore()
const added = ref(false)

function handleAdd() {
  store.addToCart(props.product)
  added.value = true
  setTimeout(() => {
    added.value = false
  }, 1000)
}
</script>

<template>
  <article class="card">
    <div class="card__media">
      <img :src="product.image" :alt="product.name" loading="lazy" />
      <span class="card__length">{{ product.length }} м</span>
    </div>

    <div class="card__body">
      <span class="card__color">Колір: {{ product.color }} • {{ product.voltage }}V</span>
      <h3 class="card__title">{{ product.name }}</h3>
      <p class="card__desc">{{ product.shortDesc }}</p>

      <div class="card__footer">
        <div class="card__price">{{ product.price }} <span>грн</span></div>
        <div class="card__actions">
          <RouterLink :to="`/product/${product.id}`" class="btn btn--outline">
            Детальніше
          </RouterLink>
          <button type="button" class="btn btn--primary" @click="handleAdd">
            {{ added ? 'Додано ✓' : 'В кошик' }}
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
@use '../assets/styles/variables' as *;

.card {
  background-color: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform $transition, border-color $transition;

  &:hover {
    transform: translateY(-4px);
    border-color: $accent-cyan;
  }

  &__media {
    position: relative;
    background: $bg-input;
    aspect-ratio: 16 / 9;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__length {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba($accent-purple, 0.92);
    color: #fff;
    font-weight: 700;
    font-size: 0.85rem;
    padding: 4px 10px;
    border-radius: 8px;
    border: 1px solid rgba($accent-cyan, 0.4);
  }

  &__body {
    padding: 18px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  &__color {
    font-size: 0.82rem;
    color: $accent-cyan;
    font-weight: 600;
    margin-bottom: 6px;
  }

  &__title {
    font-size: 1.12rem;
    margin-bottom: 8px;
    color: $text-main;
  }

  &__desc {
    color: $text-muted;
    font-size: 0.9rem;
    margin-bottom: 18px;
    flex: 1;
  }

  &__footer {
    border-top: 1px solid $border-color;
    padding-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__price {
    font-size: 1.3rem;
    font-weight: 800;
    color: $accent-gold;

    span {
      font-size: 0.9rem;
      font-weight: 500;
    }
  }

  &__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;

    .btn {
      padding: 8px 10px;
      font-size: 0.88rem;
    }
  }
}
</style>