import React, { useState, useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  Cross2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import classnames from "classnames";
import dialogStyles from "@/styles/Dialog.module.css";
import selectStyles from "@/styles/Select.module.css";

const SelectDemo = ({
  selectedPrompt: selectedPrompt,
  promptOptions: promptOptions,
  setRerender: setRerender,
  rerender: rerender,
}) => {
  const handleSelectionChange = (value) => {
    // Search promptOptions for the option with the matching value and then set the selectedPrompt to that object
    promptOptions.find((option) => {
      if (option.prompt === value) {
        selectedPrompt.current[0] = option.prompt;
        selectedPrompt.current[1] = option.asst;
        setRerender(rerender + 1);
      }
    });
  };

  return (
    <Select.Root
      // Iterate over promptOptions and set the defaultValue to the option with the matching prompt as the selectedPrompt
      defaultValue={() => {
        const defaultOption = promptOptions.find(
          (option) => selectedPrompt.current === option.prompt
        );
        return defaultOption ? defaultOption.prompt : "Custom";
      }}
      onValueChange={handleSelectionChange}
    >
      <Select.Trigger
        className={selectStyles.SelectTrigger}
        aria-label="Prompt"
      >
        <Select.Value placeholder="Prompt preset…" />
        <Select.Icon className={selectStyles.SelectIcon}>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={selectStyles.SelectContent}>
          <Select.ScrollUpButton className={selectStyles.SelectScrollButton}>
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className={selectStyles.SelectViewport}>
            <Select.Group>
              <Select.Label className={selectStyles.SelectLabel}>
                Education
              </Select.Label>
              {promptOptions.map((option, key) => (
                <SelectItem key={key} value={option.prompt}>
                  {option.label}
                </SelectItem>
              ))}
              <SelectItem value="Custom">Custom</SelectItem>
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton className={selectStyles.SelectScrollButton}>
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const SelectItem = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={classnames(selectStyles.SelectItem, className)}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className={selectStyles.SelectItemIndicator}>
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

const Prompt = ({
  selectedPrompt: selectedPrompt,
  setSelectedPrompt: setSelectedPrompt,
  promptOptions: promptOptions,
  promptOpen: promptOpen,
  setPromptOpen: setPromptOpen,
  rerender: rerender,
  setRerender: setRerender,
}) => {
  return (
    <Dialog.Root open={promptOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className={dialogStyles.DialogOverlay} />
        <Dialog.Content className={dialogStyles.DialogContent}>
          <Dialog.Title className={dialogStyles.DialogTitle}>
            Prompt
          </Dialog.Title>
          <Dialog.Description className={dialogStyles.DialogDescription}>
            Make changes to your prompt here. Click save when you're done.
          </Dialog.Description>
          <fieldset className={dialogStyles.Fieldset}>
            <label className={dialogStyles.Label} htmlFor="name">
              Select Prompt
            </label>
            <SelectDemo
              selectedPrompt={selectedPrompt}
              promptOptions={promptOptions}
              rerender={rerender}
              setRerender={setRerender}
            ></SelectDemo>
          </fieldset>
          <fieldset className={dialogStyles.Fieldset}>
            <label className={dialogStyles.Label} htmlFor="sysprompt">
              System Prompt
            </label>
            <textarea
              className={dialogStyles.Input}
              id="sysprompt"
              value={selectedPrompt.current[0]}
              onChange={(event) => {
                selectedPrompt.current[0] = event.target.value;
                setRerender(rerender + 1);
              }}
            />
          </fieldset>
          <fieldset className={dialogStyles.Fieldset}>
            <label className={dialogStyles.Label} htmlFor="asstprompt">
              Assistant Prompt
            </label>
            <textarea
              className={dialogStyles.Input}
              id="asstprompt"
              value={selectedPrompt.current[1]}
              onChange={(event) => {
                selectedPrompt.current[1] = event.target.value;
                setRerender(rerender + 1);
              }}
            />
          </fieldset>
          <div
            style={{
              display: "flex",
              marginTop: 25,
              justifyContent: "flex-end",
            }}
          >
            <Dialog.Close asChild>
              <button
                onClick={() => setPromptOpen(false)}
                className={dialogStyles.Button}
              >
                Save changes
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild onClick={() => setPromptOpen(false)}>
            <button className={dialogStyles.IconButton} aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Prompt;
