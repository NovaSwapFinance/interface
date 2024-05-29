import { useEffect } from "react";
import { useNovaTokenList } from "hooks/useNovaTokenList";

export default function useInitNovaTokenList(): void {
  const { setNovaTokenList } = useNovaTokenList();

  useEffect(() => {
    fetch(`https://explorer-api.zklink.io/tokens?limit=300`).then((res) =>
      res.json().then((all) => {
        if (!all.error) {
          setNovaTokenList(all.items);
        }
      }),
    );
  }, []);
}
