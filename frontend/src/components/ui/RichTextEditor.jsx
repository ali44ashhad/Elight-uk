import { useMemo } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link'],
  ['clean'],
]

export function RichTextEditor({ value = '', onChange, placeholder, label, className = '' }) {
  const modules = useMemo(
    () => ({
      toolbar: toolbarOptions,
    }),
    []
  )

  return (
    <div className={className}>
      {label ? (
        <span className="mb-1 block text-sm font-medium text-slate-800">{label}</span>
      ) : null}
      <div className="rounded-lg border border-slate-200 bg-white [&_.ql-toolbar]:rounded-t-lg [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:bg-slate-50 [&_.ql-container]:rounded-b-lg [&_.ql-container]:border-slate-200 [&_.ql-editor]:min-h-[140px]">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
