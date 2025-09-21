import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import PortfolioList from '../../views/Portfolio/PortfolioList.vue';
import { samplePortfolios } from '../../data/PortfolioData';

const routes = [
  { path: '/portfolios/add', component: { template: '<div>Add Portfolio</div>' } },
  { path: '/portfolios/:id', component: { template: '<div>Portfolio Detail</div>' } },
  { path: '/portfolios', component: PortfolioList },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

describe('PortfolioList.vue', () => {
  let wrapper;

  beforeEach(async () => {
    localStorage.setItem('portfolios', JSON.stringify(samplePortfolios));

    await router.push('/portfolios');
    await router.isReady();

    wrapper = mount(PortfolioList, {
      global: {
        plugins: [router],
        stubs: {
          PortfolioTabs: true,
          GradientButton: {
            name: 'GradientButton',
            template: `<button @click="$emit('click')"><slot /></button>`,
          },
        },
      },
    });

    await wrapper.vm.$nextTick();
  });

  it('renders all portfolios initially', () => {
    const cards = wrapper
      .findAll('div.bg-white.rounded-xl.shadow-md')
      .filter((w) => samplePortfolios.some((p) => w.text().includes(p.name)));

    expect(cards.length).toBe(samplePortfolios.length);
  });

  it('navigates to Add Portfolio page when create button clicked', async () => {
    const createButton = wrapper.findComponent({ name: 'GradientButton' });
    expect(createButton.exists()).toBe(true);

    await wrapper.vm.goToAddPortfolio();
    await router.isReady();

    expect(router.currentRoute.value.fullPath).toBe('/portfolios/add');
  });

  it('navigates to portfolio detail page when view details clicked', async () => {
    const firstCard = wrapper
      .findAll('div.bg-white.rounded-xl.shadow-md')
      .find((w) => w.text().includes(samplePortfolios[0].name));

    expect(firstCard).toBeTruthy();

    const viewButton = firstCard.find('button');
    expect(viewButton.exists()).toBe(true);

    // Call the exposed method
    await wrapper.vm.goToPortfolio(samplePortfolios[0].id);
    await router.isReady();

    expect(router.currentRoute.value.fullPath).toBe(`/portfolios/${samplePortfolios[0].id}`);
  });
});
