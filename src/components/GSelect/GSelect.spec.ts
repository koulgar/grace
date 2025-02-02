import { mount, Wrapper, shallowMount } from '@vue/test-utils';
import GSelect from '.';
import GCheckbox from '../GCheckbox';
import GInput from '../GInput';

describe('GSelect', () => {
  let wrapper: Wrapper<any>;

  it('should match snapshot when show is prop is given as false ', () => {
    wrapper = mount(GSelect, {
      propsData: {
        options: [
          { value: 'Value1', text: 'Text1' },
          { value: 'Value2', text: 'Text2' },
        ],
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render given default when options prop set', () => {
    wrapper = shallowMount(GSelect, {
      propsData: {
        options: [
          { value: 'Value1', text: 'Text1' },
          { value: 'Value2', text: 'Text2' },
        ],
      },
    });
    expect(wrapper.vm.icon).toEqual('chevron-down');
    expect(wrapper.vm.getValue).toEqual('');
    expect(wrapper.vm.wrapperClass).toEqual({
      '-borderless': false,
      big: true,
      'g-select': true,
    });
    expect(wrapper.vm.contentClass).toEqual({
      'g-d-none': true,
      's-content': true,
    });
  });

  it('should render given default when defaultValue prop set', () => {
    wrapper = shallowMount(GSelect, {
      propsData: {
        options: [
          { value: 'Value1', text: 'Text1' },
          { value: 'Value2', text: 'Text2' },
        ],
        value: 'Value2',
      },
    });
    expect(wrapper.vm.getValue).toEqual('Value2');
  });

  it('should render given default when size prop set', () => {
    wrapper = shallowMount(GSelect, {
      propsData: {
        options: [
          { value: 'Value1', text: 'Text1' },
          { value: 'Value2', text: 'Text2' },
        ],
        size: 'small',
      },
    });
    expect(wrapper.vm.wrapperClass).toEqual({
      '-borderless': false,
      small: true,
      'g-select': true,
    });
  });

  it('should render given default when isBorderless and placeholder prop set', () => {
    wrapper = shallowMount(GSelect, {
      propsData: {
        options: [
          { value: 'Value1', text: 'Text1' },
          { value: 'Value2', text: 'Text2' },
        ],
        placeholder: 'placeholder',
        isBorderless: true,
      },
    });
    expect(wrapper.vm.getLabel).toEqual('placeholder');
    expect(wrapper.vm.wrapperClass).toEqual({
      '-borderless': true,
      big: true,
      'g-select': true,
    });
  });

  it('the correct class and icon appears when the GSelect is clicked', async () => {
    wrapper = mount(GSelect, {
      propsData: {
        options: [
          { value: 'Value1', text: 'Text1' },
          { value: 'Value2', text: 'Text2' },
        ],
        placeholder: 'placeholder',
        isBorderless: true,
      },
    });
    wrapper.findAll('.content').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.icon).toEqual('chevron-up');
    expect(wrapper.vm.contentClass).toEqual({
      'g-d-none': false,
      's-content': true,
    });
  });

  it('should render checkbox when isCheckbox prop set', () => {
    wrapper = shallowMount(GSelect, {
      propsData: {
        options: [
          { value: 'Value1', text: 'Text1' },
          { value: 'Value2', text: 'Text2' },
        ],
        isCheckbox: true,
      },
    });

    expect(wrapper.findAllComponents(GCheckbox).length).toEqual(2);
    expect(wrapper.findAll('.text').length).toEqual(2);
    expect(
      wrapper
        .findAll('.text')
        .at(1)
        .text()
    ).toEqual('Text2');
  });

  it('should render checkbox when isSearch prop set', () => {
    wrapper = shallowMount(GSelect, {
      propsData: {
        options: [
          { value: 'Value1', text: 'Text1' },
          { value: 'Value2', text: 'Text2' },
        ],
        isSearch: true,
      },
    });

    expect(wrapper.findAllComponents(GInput).length).toEqual(1);
  });

  it('should emit blur event if select is closed', async () => {
    // given
    wrapper = mount(GSelect, {
      propsData: {
        options: [
          { value: 'Value1', text: 'Text1' },
          { value: 'Value2', text: 'Text2' },
        ],
        placeholder: 'placeholder',
        isBorderless: true,
      },
    });

    wrapper.find('.content').trigger('click'); // open select
    await wrapper.vm.$nextTick();

    // when
    wrapper.find('.content').trigger('click'); // close select
    await wrapper.vm.$nextTick();

    // then
    expect(wrapper.emitted().blur).toBeTruthy();
  });

  it('should checkbox and text disable when disabled prop is true', () => {
    wrapper = mount(GSelect, {
      propsData: {
        options: [
          { value: 'Value1', text: 'Text1' },
          { value: 'Value2', text: 'Text2', disabled: true },
          { value: 'Value3', text: 'Text3' },
        ],
        isCheckbox: true,
      },
    });

    const optionItem = wrapper.findAll('.item').at(1);

    expect(optionItem.classes().includes('disabled')).toBeTruthy();
    expect(
      optionItem
        .find('.-input')
        .attributes()
        .hasOwnProperty('disabled')
    ).toBeTruthy();
    expect(
      optionItem
        .find('.text')
        .classes()
        .includes('disabled')
    ).toBeTruthy();
  });

  it('should render correct snapshot with given text and value keys', () => {
    const options = [
      { id: 'id1', name: 'name1' },
      { id: 'id2', name: 'name2' },
      { id: 'id3', name: 'name3' },
    ];

    wrapper = mount(GSelect, {
      propsData: {
        options,
        valueKey: 'id',
        textKey: 'name',
      },
    });

    expect(wrapper.find('.text').text()).toEqual(options[0].name);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('given default reduceValue should emit input with value when item text is clicked', () => {
    const options = [
      { value: 'Value1', text: 'Text1' },
      { value: 'Value2', text: 'Text2' },
    ];
    wrapper = mount(GSelect, {
      propsData: {
        options,
        placeholder: 'placeholder',
        isBorderless: true,
      },
    });

    wrapper.find('.text').trigger('click');

    const inputValue = wrapper.emitted()?.input?.[0][0];
    expect(inputValue).toEqual(options[0].value);
  });

  it('given reduceValue function should emit input its output', async () => {
    type Item = { value: string; text: string };
    const options: Item[] = [
      { value: 'Value1', text: 'Text1' },
      { value: 'Value2', text: 'Text2' },
    ];
    const reduceValue = (item: Item) => {
      return { asd: item.value + 'reduced' };
    };

    wrapper = mount({
      data() {
        return { value: [], options };
      },
      methods: {
        reduceValue,
      },
      template:
        '<GSelect v-model="value" :options="options" is-checkbox :reduce-value="reduceValue" />',
      components: { GSelect },
    });

    const optionWrappers = wrapper.findAll('.text');

    optionWrappers.at(0).trigger('click');
    expect(wrapper.vm.value).toContainEqual(reduceValue(options[0]));

    await wrapper.vm.$nextTick();

    optionWrappers.at(1).trigger('click');
    expect(wrapper.vm.value).toContainEqual(reduceValue(options[1]));

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.valueText').text()).toContain(options[0].text);
    expect(wrapper.find('.valueText').text()).toContain(options[1].text);
  });

  it('should emit clear and set value null if showClearButton prop is true and clear icon clicked', () => {
    const options = [
      { value: 'Value1', text: 'Text1' },
      { value: 'Value2', text: 'Text2' },
    ];

    wrapper = mount(GSelect, {
      propsData: {
        options,
        value: options[0].value,
        showClearButton: true,
      },
    });

    wrapper.find('.g-icon.feather.feather--x').trigger('click');

    const emitted = wrapper.emitted()
    expect(emitted.input?.[0][0]).toEqual(null)
    expect(emitted.clear).toBeTruthy()
  })

  it('should emit clear and set value empty array if showClearButton and isCheckbox props are true and clear icon clicked', () => {
    const options = [
      { value: 'Value1', text: 'Text1' },
      { value: 'Value2', text: 'Text2' },
    ];

    wrapper = mount(GSelect, {
      propsData: {
        options,
        value: [options[0].value],
        isCheckbox: true,
        showClearButton: true,
      },
    });

    wrapper.find('.g-icon.feather.feather--x').trigger('click');

    const emitted = wrapper.emitted()
    expect(emitted.input?.[0][0]).toEqual([])
    expect(emitted.clear).toBeTruthy()
  })

  it('should not display clear icon when disable prop is true', () => {
    const options = [
      { value: 'Value1', text: 'Text1' },
      { value: 'Value2', text: 'Text2' },
    ];

    wrapper = mount(GSelect, {
      propsData: {
        options,
        value: [options[0].value],
        isCheckbox: true,
        showClearButton: true,
        disable: true,
      },
    });

    expect(wrapper.find('.g-icon.feather.feather--x').exists()).toBeFalsy()
  })
});
