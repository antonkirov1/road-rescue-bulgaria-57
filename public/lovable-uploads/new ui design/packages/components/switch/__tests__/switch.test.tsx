import type {UserEvent} from "@testing-library/user-event";

import * as React from "react";
import {render, renderHook} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {useForm} from "react-hook-form";

import {Switch} from "../src";

describe("Switch", () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("should render correctly", () => {
    const wrapper = render(<Switch aria-label="switch" />);

    expect(() => wrapper.unmount()).not.toThrow();
  });

  it("ref should be forwarded", () => {
    const ref = React.createRef<HTMLInputElement>();

    render(<Switch ref={ref} aria-label="switch" />);
    expect(ref.current).not.toBeNull();
  });

  it("should check and uncheck", async () => {
    const {getByRole} = render(<Switch aria-label="switch" />);

    const checkbox = getByRole("switch");

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("should not check if disabled", async () => {
    const {getByRole} = render(<Switch isDisabled aria-label="switch" />);

    const checkbox = getByRole("switch");

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("should be checked if defaultSelected", () => {
    const {getByRole} = render(<Switch defaultSelected aria-label="switch" />);

    const checkbox = getByRole("switch");

    expect(checkbox).toBeChecked();
  });

  it("should not check if readOnly", async () => {
    const {getByRole} = render(<Switch isReadOnly aria-label="switch" />);

    const checkbox = getByRole("switch");

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("should check and uncheck with controlled state", async () => {
    const ControlledSwitch = ({onChange}: any) => {
      const [isSelected, setIsSelected] = React.useState(false);

      return (
        <Switch
          aria-label="switch"
          isSelected={isSelected}
          onValueChange={(selected) => {
            onChange?.(selected);
            setIsSelected(selected);
          }}
        />
      );
    };

    const onChange = jest.fn();

    const {getByRole} = render(<ControlledSwitch onChange={onChange} />);

    const checkbox = getByRole("switch");

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("should render the thumbIcon", () => {
    const wrapper = render(
      <Switch aria-label="switch" thumbIcon={<svg data-testid="thumb-icon" />} />,
    );

    expect(wrapper.getByTestId("thumb-icon")).toBeInTheDocument();
  });

  it('should work with thumbIcon as "function"', () => {
    const thumbIcon = jest.fn(() => <svg data-testid="thumb-icon" />);

    const wrapper = render(<Switch aria-label="switch" thumbIcon={thumbIcon} />);

    expect(thumbIcon).toHaveBeenCalled();
    expect(wrapper.getByTestId("thumb-icon")).toBeInTheDocument();
  });

  it("should change the thumbIcon when clicked", async () => {
    const thumbIcon = jest.fn((props) => {
      const {isSelected} = props;

      return isSelected ? (
        <svg data-testid="checked-thumb-icon" />
      ) : (
        <svg data-testid="unchecked-thumb-icon" />
      );
    });

    const {getByRole, container} = render(<Switch aria-label="switch" thumbIcon={thumbIcon} />);

    const checkbox = getByRole("switch");

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    expect(thumbIcon).toHaveBeenCalledWith(
      expect.objectContaining({
        isSelected: true,
      }),
    );

    const checkedthumbIcon = container.querySelector("[data-testid=checked-thumb-icon]");

    expect(checkedthumbIcon).toBeInTheDocument();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();

    expect(thumbIcon).toHaveBeenCalledWith(
      expect.objectContaining({
        isSelected: false,
      }),
    );

    const uncheckedthumbIcon = container.querySelector("[data-testid=unchecked-thumb-icon]");

    expect(uncheckedthumbIcon).toBeInTheDocument();
  });

  it('should work with "startContent"', () => {
    const wrapper = render(
      <Switch aria-label="switch" startContent={<svg data-testid="start-icon" />} />,
    );

    expect(wrapper.getByTestId("start-icon")).toBeInTheDocument();
  });

  it('should work with "endContent"', () => {
    const wrapper = render(
      <Switch aria-label="switch" endContent={<svg data-testid="end-icon" />} />,
    );

    expect(wrapper.getByTestId("end-icon")).toBeInTheDocument();
  });

  it('should work with "startContent" and "endContent"', () => {
    const wrapper = render(
      <Switch
        aria-label="switch"
        endContent={<svg data-testid="end-icon" />}
        startContent={<svg data-testid="start-icon" />}
      />,
    );

    expect(wrapper.getByTestId("start-icon")).toBeInTheDocument();
    expect(wrapper.getByTestId("end-icon")).toBeInTheDocument();
  });
});

describe("Switch with React Hook Form", () => {
  let switch1: HTMLInputElement;
  let switch2: HTMLInputElement;
  let switch3: HTMLInputElement;
  let submitButton: HTMLButtonElement;
  let onSubmit: () => void;

  beforeEach(() => {
    const {result} = renderHook(() =>
      useForm({
        defaultValues: {
          defaultTrue: true,
          defaultFalse: false,
          requiredField: false,
        },
      }),
    );

    const {
      register,
      formState: {errors},
      handleSubmit,
    } = result.current;

    onSubmit = jest.fn();

    render(
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Switch {...register("defaultTrue")}>By default this switch is true</Switch>
        <Switch {...register("defaultFalse")}>By default this switch is false</Switch>
        <Switch {...register("requiredField", {required: true})}>This switch is required</Switch>
        {errors.requiredField && <span className="text-danger">This switch is required</span>}
        <button type="submit">Submit</button>
      </form>,
    );

    switch1 = document.querySelector("input[name=defaultTrue]")!;
    switch2 = document.querySelector("input[name=defaultFalse]")!;
    switch3 = document.querySelector("input[name=requiredField]")!;
    submitButton = document.querySelector("button")!;
  });

  it("should work with defaultValues", () => {
    expect(switch1.checked).toBe(true);
    expect(switch2.checked).toBe(false);
    expect(switch3.checked).toBe(false);
  });

  it("should not submit form when required field is empty", async () => {
    const user = userEvent.setup();

    await user.click(submitButton);
    expect(onSubmit).toHaveBeenCalledTimes(0);
  });

  it("should submit form when required field is not empty", async () => {
    const user = userEvent.setup();

    await switch3.click();
    expect(switch3.checked).toBe(true);

    await user.click(submitButton);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
