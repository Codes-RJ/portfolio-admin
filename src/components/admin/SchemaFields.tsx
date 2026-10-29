import { useId, useState } from 'react';
import { z } from 'zod';
import { ImageUploadField } from '../ui/ImageUploadField';

function unwrapSchema(schema: z.ZodType): z.ZodType {
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodDefault || schema instanceof z.ZodNullable) return unwrapSchema(schema.unwrap() as z.ZodType);
  return schema;
}

function emptySchemaValue(schema: z.ZodType, field = ''): unknown {
  schema = unwrapSchema(schema);
  if (schema instanceof z.ZodObject) return Object.fromEntries(Object.entries(schema.shape).filter(([, value]) => !(value instanceof z.ZodOptional)).map(([key, value]) => [key, emptySchemaValue(value as z.ZodType, key)]));
  if (schema instanceof z.ZodArray) return [];
  if (schema instanceof z.ZodRecord) return {};
  if (schema instanceof z.ZodEnum) return schema.options[0];
  if (schema instanceof z.ZodUnion) return emptySchemaValue(schema.options[0] as z.ZodType, field);
  if (schema instanceof z.ZodNumber) return 0;
  if (schema instanceof z.ZodBoolean) return false;
  if (field === 'id') return crypto.randomUUID();
  if (field === 'slug') return `new-article-${crypto.randomUUID().slice(0, 8)}`;
  return '';
}

const fieldLabel = (name: string) => name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ').replace(/^./, (letter) => letter.toUpperCase());
const inputClass = 'w-full min-w-0 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm';

/** All schema fields, including optional and nested fields, use real form inputs. */
export function SchemaFields({ schema: originalSchema, value, onChange, name, path = name }: {
  schema: z.ZodType; value: unknown; onChange: (next: unknown) => void; name: string; path?: string;
}) {
  const inputId = useId();
  const [newKey, setNewKey] = useState('');
  const schema = unwrapSchema(originalSchema);
  const label = fieldLabel(name);
  if (value === undefined) return <div className="flex items-center justify-between gap-3 py-2"><span>{label} (optional)</span><button type="button" onClick={() => onChange(emptySchemaValue(schema, name))}>Add {label}</button></div>;
  if (originalSchema instanceof z.ZodOptional) return <div className="space-y-1"><SchemaFields schema={schema} value={value} onChange={onChange} name={name} path={path} /><button type="button" className="text-xs text-gray-500" onClick={() => onChange(undefined)}>Reset optional {label}</button></div>;
  if (schema instanceof z.ZodUnion) {
    const branch = schema.options.find((option) => (unwrapSchema(option as z.ZodType) instanceof z.ZodNumber) === (typeof value === 'number') && (unwrapSchema(option as z.ZodType) instanceof z.ZodArray) === Array.isArray(value)) as z.ZodType | undefined;
    return <SchemaFields schema={branch ?? schema.options[0] as z.ZodType} value={value} onChange={onChange} name={name} path={path} />;
  }
  if (schema instanceof z.ZodObject) {
    const object = value as Record<string, unknown>;
    return <fieldset className="space-y-3 min-w-0 rounded-xl border border-gray-200 dark:border-gray-800 p-3"><legend className="font-semibold px-2">{label}</legend>{Object.entries(schema.shape).map(([key, child]) => <SchemaFields key={key} schema={child as z.ZodType} value={object[key]} onChange={(next) => onChange({ ...object, [key]: next })} name={key} path={`${path}.${key}`} />)}</fieldset>;
  }
  if (schema instanceof z.ZodArray) {
    const items = value as unknown[];
    return <details className="min-w-0 rounded-xl border border-gray-200 dark:border-gray-800 p-3"><summary className="cursor-pointer font-semibold">{label} ({items.length})</summary><div className="space-y-3 mt-3">{items.map((item, index) => <div key={index} className="space-y-2 border-b border-gray-200 dark:border-gray-800 pb-3"><SchemaFields schema={schema.element as z.ZodType} value={item} onChange={(next) => onChange(items.map((old, i) => i === index ? next : old))} name={typeof item === 'object' && item ? String((item as Record<string, unknown>).title || (item as Record<string, unknown>).name || `Item ${index + 1}`) : `Item ${index + 1}`} path={`${path}.${index}`} /><div className="flex flex-wrap gap-4 text-xs"><button type="button" disabled={!index} aria-label={`Move ${label} item ${index + 1} up`} onClick={() => { const next = [...items]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(next); }}>Move up</button><button type="button" disabled={index === items.length - 1} aria-label={`Move ${label} item ${index + 1} down`} onClick={() => { const next = [...items]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; onChange(next); }}>Move down</button><button type="button" aria-label={`Remove ${label} item ${index + 1}`} onClick={() => onChange(items.filter((_, i) => i !== index))}>Remove</button></div></div>)}<button type="button" onClick={() => onChange([...items, emptySchemaValue(schema.element as z.ZodType)])}>Add {label} item</button></div></details>;
  }
  if (schema instanceof z.ZodRecord) {
    const object = value as Record<string, unknown>;
    return <details className="rounded-xl border border-gray-200 dark:border-gray-800 p-3"><summary>{label} ({Object.keys(object).length})</summary><div className="space-y-3 mt-3">{Object.entries(object).map(([key, child]) => <div key={key}><SchemaFields schema={schema.valueType as z.ZodType} value={child} name={key} path={`${path}.${key}`} onChange={(next) => onChange({ ...object, [key]: next })} /><button type="button" className="text-xs mt-1" onClick={() => onChange(Object.fromEntries(Object.entries(object).filter(([old]) => old !== key)))}>Remove {key}</button></div>)}<label htmlFor={inputId}>New {label} key</label><input id={inputId} className={inputClass} value={newKey} onChange={(event) => setNewKey(event.target.value)} /><button type="button" disabled={!newKey.trim() || Object.prototype.hasOwnProperty.call(object, newKey.trim()) || ['__proto__', 'constructor', 'prototype'].includes(newKey.trim())} onClick={() => { onChange({ ...object, [newKey.trim()]: emptySchemaValue(schema.valueType as z.ZodType) }); setNewKey(''); }}>Add entry</button></div></details>;
  }
  if (schema instanceof z.ZodBoolean) return <label className="flex gap-3 items-center"><input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />{label}</label>;
  if (schema instanceof z.ZodEnum) return <div><label htmlFor={inputId}>{label}</label><select id={inputId} className={inputClass} value={String(value)} onChange={(event) => onChange(event.target.value)}>{schema.options.map((option) => <option key={String(option)} value={String(option)}>{String(option)}</option>)}</select></div>;
  if (['image', 'imageUrl', 'avatarUrl', 'aboutPhotoUrl'].includes(name)) return <ImageUploadField label={label} value={String(value)} onChange={onChange} />;
  return <div><label htmlFor={inputId}>{label}</label>{schema instanceof z.ZodNumber ? <input id={inputId} className={inputClass} type="number" step="any" value={String(value)} onChange={(event) => onChange(event.target.value === '' ? '' : Number(event.target.value))} /> : <textarea id={inputId} className={inputClass} rows={String(value).length > 180 ? 5 : 2} value={String(value)} onChange={(event) => onChange(event.target.value)} />}</div>;
}
