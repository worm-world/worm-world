import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditableDiv from 'components/EditableDiv/EditableDiv';
import { vi } from 'vitest';

describe('Editable div', () => {
  test('Renders', () => {
    render(
      <EditableDiv
        value=''
        setValue={() => {}}
        editable={false}
        setEditable={() => {}}
        onFinishEditing={() => {}}
      />
    );

    const editableDiv = screen.getByTestId('editableDiv');
    expect(editableDiv).toBeDefined();
  });

  test('Displays placeholder if empty value', async () => {
    const value = '';
    const placeholder = 'placeholder';
    render(
      <EditableDiv
        value={value}
        setValue={() => {}}
        editable={false}
        setEditable={() => {}}
        onFinishEditing={() => {}}
        placeholder={placeholder}
      />
    );

    const editableDiv = screen.getByText(placeholder);
    expect(editableDiv).toBeDefined();
  });

  test('Displays value instead of placeholder', async () => {
    const value = 'something';
    const placeholder = 'placeholder';
    render(
      <EditableDiv
        value={value}
        setValue={() => {}}
        editable={false}
        setEditable={() => {}}
        onFinishEditing={() => {}}
        placeholder={placeholder}
      />
    );

    const editableDiv = screen.getByTestId('editableDiv');
    expect(editableDiv).toHaveTextContent(value);
  });

  test('Has text input element if editable', () => {
    render(
      <EditableDiv
        value=''
        setValue={() => {}}
        editable={true}
        setEditable={() => {}}
        onFinishEditing={() => {}}
      />
    );

    const editableDiv = screen.queryByRole('textbox');
    expect(editableDiv).not.toBeNull();
  });

  test('Does not have text input element if not editable', () => {
    render(
      <EditableDiv
        value=''
        setValue={() => {}}
        editable={false}
        setEditable={() => {}}
        onFinishEditing={() => {}}
      />
    );

    const editableDiv = screen.queryByRole('textbox');
    expect(editableDiv).toBeNull();
  });

  test('Invokes callback on enter', async () => {
    const user = userEvent.setup();
    let value = 'initial value';
    const setValue = (newValue: string): void => {
      value = newValue;
    };
    let editable = true;
    const setEditable = (newEditable: boolean): void => {
      editable = newEditable;
    };
    const mockOnFinishEditing = vi.fn();

    render(
      <EditableDiv
        value={value}
        setValue={setValue}
        editable={editable}
        setEditable={setEditable}
        onFinishEditing={mockOnFinishEditing}
      />
    );
    expect(mockOnFinishEditing).not.toBeCalled();
    await user.keyboard('{enter}');
    expect(mockOnFinishEditing).toBeCalledTimes(1);
  });

  test('Invokes callback on click away', async () => {
    const user = userEvent.setup();
    let value = 'initial value';
    const setValue = (newValue: string): void => {
      value = newValue;
    };
    let editable = true;
    const setEditable = (newEditable: boolean): void => {
      editable = newEditable;
    };
    const mockOnFinishEditing = vi.fn();

    render(
      <EditableDiv
        value={value}
        setValue={setValue}
        editable={editable}
        setEditable={setEditable}
        onFinishEditing={mockOnFinishEditing}
      />
    );

    expect(mockOnFinishEditing).not.toBeCalled();
    await user.click(document.body);
    expect(mockOnFinishEditing).toBeCalledTimes(1);
  });

  test('Calls handler to click', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(
      <EditableDiv
        value=''
        setValue={() => {}}
        editable={false}
        setEditable={() => {}}
        onFinishEditing={() => {}}
        onClick={mockOnClick}
      />
    );

    const editableDiv = screen.getByTestId('editableDiv');
    expect(mockOnClick).not.toBeCalled();
    await user.click(editableDiv);
    expect(mockOnClick).not.toBeCalledTimes(1);
  });
});
