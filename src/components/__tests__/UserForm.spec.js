import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import UserForm from '../../views/users/UserForm.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [],
});

describe('UserForm.vue', () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = mount(UserForm, {
      global: {
        plugins: [router],
        stubs: ['router-link', 'router-view', 'ArrowLeft', 'Save', 'Badge', 'Menu', 'MenuButton', 'MenuItems', 'MenuItem', 'Transition', 'ChevronDownIcon'],
      },
    });
    await router.isReady();
  });

  it('renders all input fields', () => {
    expect(wrapper.find('input[placeholder="Enter client\'s full name"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="client@example.com"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="+91 98765 43210"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="5,00,000"]').exists()).toBe(true); // initial investment
  });

  it('shows validation errors when form submitted empty', async () => {
    await wrapper.find('form').trigger('submit.prevent');

    const text = wrapper.text();
    expect(text).toContain('Full Name is required');
    expect(text).toContain('Email is required');
    expect(text).toContain('Phone number is required');
    expect(text).toContain('Risk Tolerance is required');
  });

  it('updates client reactive data when input changes', async () => {
    const fullNameInput = wrapper.find('input[placeholder="Enter client\'s full name"]');
    const emailInput = wrapper.find('input[placeholder="client@example.com"]');
    const phoneInput = wrapper.find('input[placeholder="+91 98765 43210"]');

    await fullNameInput.setValue('John Doe');
    await emailInput.setValue('john@example.com');
    await phoneInput.setValue('9876543210');

    expect(wrapper.vm.client.fullName).toBe('John Doe');
    expect(wrapper.vm.client.email).toBe('john@example.com');
    expect(wrapper.vm.client.phone).toBe('9876543210');
  });

  it('submits form successfully when required fields are filled', async () => {
    await wrapper.find('input[placeholder="Enter client\'s full name"]').setValue('John Doe');
    await wrapper.find('input[placeholder="client@example.com"]').setValue('john@example.com');
    await wrapper.find('input[placeholder="+91 98765 43210"]').setValue('9876543210');

    await wrapper.vm.selectRisk('MODERATE');

    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.vm.errors.fullName).toBe('');
    expect(wrapper.vm.errors.email).toBe('');
    expect(wrapper.vm.errors.phone).toBe('');
    expect(wrapper.vm.errors.riskTolerance).toBe('');

    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    expect(clients[clients.length - 1].fullName).toBe('John Doe');
  });
});
