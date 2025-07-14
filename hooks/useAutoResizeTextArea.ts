import { useEffect, useRef } from 'react';

export const useAutoResizeTextArea = (value: string) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.style.height = 'auto';
      const scrollHeight = element.scrollHeight;
      element.style.height = `${scrollHeight}px`;
    }
  }, [value]);

  return ref;
};
