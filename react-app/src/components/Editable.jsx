import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSiteData } from "../context/SiteDataContext";
import EditModal from "./EditModal";

// Default permission required to edit: textos.modificar
const DEFAULT_RESOURCE = "textos";
const DEFAULT_ACTION = "modificar";

export function EditableText({
  path,
  value,
  tag: Tag = "span",
  className,
  style,
  children,
  resource = DEFAULT_RESOURCE,
  action = DEFAULT_ACTION,
}) {
  const { can } = useAuth();
  const { saveField } = useSiteData();
  const [editing, setEditing] = useState(false);

  const display = children ?? value ?? "";
  const allowed = can(resource, action);

  if (!allowed) {
    return (
      <Tag className={className} style={style}>
        {display}
      </Tag>
    );
  }

  return (
    <>
      <Tag
        className={`${className ?? ""} admin-editable`}
        style={style}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setEditing(true);
        }}
        title="Clic per editar"
      >
        {display}
      </Tag>
      {editing && (
        <EditModal
          value={value}
          type="text"
          onSave={(v) => {
            saveField("content", path, v);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      )}
    </>
  );
}

export function EditableImage({
  path,
  src,
  alt,
  className,
  style,
  loading,
  resource = DEFAULT_RESOURCE,
  action = DEFAULT_ACTION,
}) {
  const { can } = useAuth();
  const { saveField } = useSiteData();
  const [editing, setEditing] = useState(false);

  const imgSrc = src ?? "";
  const imgAlt = alt ?? "";
  const allowed = can(resource, action);

  if (!allowed) {
    return <img className={className} style={style} src={imgSrc} alt={imgAlt} loading={loading} />;
  }

  return (
    <>
      <img
        className={`${className ?? ""} admin-editable`}
        style={style}
        src={imgSrc}
        alt={imgAlt}
        loading={loading}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setEditing(true);
        }}
        title="Clic per editar imatge"
      />
      {editing && (
        <EditModal
          value={imgSrc}
          type="image"
          pathKey={path}
          onSave={(v) => {
            saveField("images", path, v);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      )}
    </>
  );
}
