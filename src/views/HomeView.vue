<script setup>
import { onMounted, computed } from 'vue'
import { useFluxarStore } from '../stores/fluxarStore'
import ProductCard from '../components/ProductCard.vue'

const store = useFluxarStore()

onMounted(() => {
  store.loadProducts()
})

// Показуємо 3 популярні позиції різної напруги (5V, 12V, 24V) на головній
const featuredProducts = computed(() => {
  return store.products.filter((p) => [1, 10, 16].includes(p.id))
})
</script>

<template>
  <div class="home">
    <!-- Hero-банер -->
    <section class="hero">
      <div class="container hero__inner">
        <div class="hero__content">
          <span class="hero__tag">Автономні LED-системи • 5V / 9V / 12V / 24V</span>
          <h1 class="hero__title">
            Світло, що створює простір разом із <span>FLUXAR</span>
          </h1>
          <p class="hero__subtitle">
            Продумані світлодіодні рішення для дому, робочих місць та автономного освітлення від павербанків і зарядних станцій.
          </p>
          <div class="hero__buttons">
            <RouterLink to="/catalog" class="btn btn--primary">Перейти до каталогу</RouterLink>
            <RouterLink to="/custom-order" class="btn btn--outline">Індивідуальне замовлення</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Опис бренду FLUXAR -->
    <section class="about page-section">
      <div class="container">
        <div class="about__grid">
          <div class="about__card">
            <h2 class="section-title">Про бренд <span>FLUXAR</span></h2>
            <p>
              <strong>FLUXAR</strong> — це більше, ніж магазин освітлення. Це бренд, створений навколо ідеї, що світло формує настрій, продуктивність і комфорт у повсякденному житті. Ми спеціалізуємося на сучасних LED-рішеннях для дому, робочих просторів та декоративного освітлення, допомагаючи перетворювати звичайні приміщення на стильні та функціональні простори.
            </p>
            <p>
              Ми віримо, що правильне освітлення здатне змінити сприйняття простору. Саме тому у FLUXAR ви знайдете не просто лампи чи LED-стрічки, а продумані світлові рішення, які підкреслюють інтер’єр, створюють атмосферу затишку або фокусують увагу там, де це потрібно.
            </p>
            <p>
              <strong>FLUXAR</strong> — це вибір для тих, хто хоче контролювати світло у своєму просторі. Від яскравого робочого освітлення до м’якого декоративного підсвічування — ми допомагаємо знайти баланс між функціональністю та естетикою.
            </p>
          </div>

          <div class="about__pillars">
            <div class="pillar">
              <h3>Чому обирають FLUXAR?</h3>
              <p>
                Ми ретельно відбираємо асортимент, орієнтуючись на три ключові принципи: <strong>якість, ефективність і дизайн</strong>. Кожен продукт проходить перевірку, щоб відповідати сучасним стандартам надійності та енергоефективності. Наші LED-рішення споживають менше електроенергії, служать довше та забезпечують стабільне, рівномірне світло без мерехтіння.
              </p>
            </div>

            <div class="pillar pillar--purple">
              <h3>Наша філософія</h3>
              <p>
                Ми постійно стежимо за світовими трендами у сфері освітлення та впроваджуємо актуальні рішення, які відповідають сучасному стилю життя. Для нас важливо, щоб кожен клієнт отримував не лише якісний товар, а й впевненість у своєму виборі.
              </p>
              <p>
                Ми відкриті до спілкування, консультуємо та допомагаємо підібрати оптимальне рішення під конкретні потреби — будь то освітлення кімнати, робочого столу, ігрової зони чи комерційного простору.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Популярні комплекти -->
    <section class="featured page-section">
      <div class="container">
        <div class="featured__head">
          <h2 class="section-title">Популярні <span>LED-рішення</span></h2>
          <RouterLink to="/catalog" class="btn btn--outline">Усі 20 моделей →</RouterLink>
        </div>

        <div v-if="store.isLoading" class="status-box">Завантаження каталогу...</div>
        <div v-else class="products-grid">
          <ProductCard
            v-for="item in featuredProducts"
            :key="item.id"
            :product="item"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/styles/variables' as *;

.hero {
  background: radial-gradient(circle at top right, rgba($accent-purple, 0.28), transparent 55%),
              radial-gradient(circle at bottom left, rgba($accent-cyan, 0.16), transparent 50%),
              $bg-card;
  border-bottom: 1px solid $border-color;
  padding: 64px 0;

  &__content {
    max-width: 720px;
  }

  &__tag {
    display: inline-block;
    background: rgba($accent-cyan, 0.12);
    border: 1px solid rgba($accent-cyan, 0.4);
    color: $accent-cyan;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 999px;
    margin-bottom: 18px;
  }

  &__title {
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.2;
    margin-bottom: 18px;

    span {
      color: $accent-gold;
    }
  }

  &__subtitle {
    color: $text-muted;
    font-size: 1.1rem;
    margin-bottom: 28px;
  }

  &__buttons {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }
}

.about {
  &__grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 24px;
  }

  &__card,
  .pillar {
    background: $bg-card;
    border: 1px solid $border-color;
    border-radius: $radius-lg;
    padding: 26px;

    p {
      color: $text-muted;
      margin-bottom: 14px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    strong {
      color: $text-main;
    }
  }

  &__pillars {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .pillar {
    border-left: 4px solid $accent-cyan;

    h3 {
      color: $accent-gold;
      margin-bottom: 10px;
      font-size: 1.2rem;
    }

    &--purple {
      border-left-color: $accent-purple;
    }
  }
}

.featured {
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 24px;

    .section-title {
      margin-bottom: 0;
    }
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 22px;
}

.status-box {
  background: $bg-card;
  padding: 24px;
  border-radius: $radius-md;
  text-align: center;
  color: $accent-cyan;
}

@media (max-width: 850px) {
  .about__grid {
    grid-template-columns: 1fr;
  }
}
</style>