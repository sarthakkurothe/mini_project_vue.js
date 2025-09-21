import { describe, it, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { createStore } from 'vuex';
import PortfolioDetail from '../../views/Portfolio/PortfolioDetail.vue';
import { samplePortfolios } from '../../data/PortfolioData';
import { mockHoldings } from '../../data/mockHoldings';

// Define routes
const routes = [
  { path: '/portfolios', component: { template: '<div>Portfolio List</div>' } },
  { path: '/portfolios/:id', component: PortfolioDetail },
  { path: '/portfolios/:id/edit', component: { template: '<div>Edit Portfolio</div>' } },
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Create Vuex store
const store = createStore({
  modules: {
    portfolio: {
      namespaced: true,
      state: () => ({ editing: null }),
      mutations: {
        setEditing(state, payload) {
          state.editing = payload;
        },
      },
    },
  },
});

describe('PortfolioDetail.vue', () => {
  beforeEach(() => {
    localStorage.setItem('portfolios', JSON.stringify(samplePortfolios));
  });

  it('renders "Portfolio Not Found" if invalid id', async () => {
    await router.push('/portfolios/invalid');
    await router.isReady();

    const wrapper = mount(PortfolioDetail, {
      global: { plugins: [router, store] },
    });

    expect(wrapper.text()).toContain('Portfolio Not Found');
    expect(wrapper.text()).toContain('The requested portfolio could not be found.');
  });

  it('renders portfolio details if valid id', async () => {
    const portfolioId = samplePortfolios[0].id;
    await router.push(`/portfolios/${portfolioId}`);
    await router.isReady();

    const wrapper = mount(PortfolioDetail, {
      global: { plugins: [router, store] },
    });

    // Portfolio info
    expect(wrapper.text()).toContain(samplePortfolios[0].name);
    expect(wrapper.text()).toContain(samplePortfolios[0].clientName);

    // Portfolio holdings
    const portfolioHoldings = mockHoldings.filter(h => h.portfolioId === portfolioId);
    portfolioHoldings.forEach(holding => {
      expect(wrapper.text()).toContain(holding.symbol);
      expect(wrapper.text()).toContain(holding.name);
    });
  });

  it('navigates back when back button clicked', async () => {
    const portfolioId = samplePortfolios[0].id;
    await router.push(`/portfolios/${portfolioId}`);
    await router.isReady();

    const wrapper = mount(PortfolioDetail, {
      global: { plugins: [router, store] },
    });

    const backButton = wrapper.find('[data-testid="back-button"]');
    expect(backButton.exists()).toBe(true);

    await backButton.trigger('click');
    await flushPromises(); // wait for navigation

    expect(router.currentRoute.value.fullPath).toBe('/portfolios');
  });

  it('commits store and navigates on edit', async () => {
    const portfolioId = samplePortfolios[0].id;
    await router.push(`/portfolios/${portfolioId}`);
    await router.isReady();

    const wrapper = mount(PortfolioDetail, {
      global: { plugins: [router, store] },
    });

    const editButton = wrapper.find('[data-testid="edit-button"]');
    expect(editButton.exists()).toBe(true);

    await editButton.trigger('click');
    await flushPromises(); // wait for navigation

    // Vuex state
    expect(store.state.portfolio.editing).toEqual(samplePortfolios[0]);

    // Navigation
    expect(router.currentRoute.value.fullPath).toBe(`/portfolios/${portfolioId}/edit`);
  });
});
