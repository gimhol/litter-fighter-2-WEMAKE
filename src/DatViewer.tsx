import { useRef } from "react";
import { Button } from "./Component/Buttons/Button";
import { ITextAreaRef, TextArea } from "./Component/TextArea";
import open_file, { read_file } from "./Utils/open_file";
import dat_to_json from "./LF2/dat_translator/dat_2_json";
import decode_lf2_dat from "./LF2/dat_translator/decode_lf2_dat";
import styles from "./App.module.scss";

export interface IEditorViewProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
  open?: boolean;
}
export default function DatViewer(props: IEditorViewProps) {
  const { onClose, loading, open } = props;
  const _ref_textarea_dat = useRef<ITextAreaRef>(null);
  const _ref_textarea_json = useRef<ITextAreaRef>(null);

  const _ref_txt_dat = useRef<string>("");
  const _ref_txt_json = useRef<string>("");

  const on_click_read_dat = async () => {
    const [file] = await open_file({ accept: ".dat" });
    const buf = await read_file(file, { as: "ArrayBuffer" });
    const str_dat = await decode_lf2_dat(buf);
    const data = await dat_to_json(str_dat, {
      id: "",
      type: "",
      file: "",
    });
    _ref_txt_dat.current = str_dat;
    _ref_txt_json.current = JSON.stringify(data, null, 2);
    if (_ref_textarea_dat.current)
      _ref_textarea_dat.current.value = _ref_txt_dat.current;
    if (_ref_textarea_json.current)
      _ref_textarea_json.current.value = _ref_txt_json.current;
  };
  if (!open) return <></>;
  return (
    <div className={styles.editor_view}>
      <div className={styles.top}>
        <Button onClick={onClose} disabled={loading}>
          ✕
        </Button>
        <Button
          onClick={() => on_click_read_dat().catch(console.warn)}
          disabled={loading}
        >
          打开
        </Button>
      </div>
      <div className={styles.main}>
        <TextArea ref={_ref_textarea_dat} wrap="off" />
        <TextArea ref={_ref_textarea_json} wrap="off" />
      </div>
    </div>
  );
}
