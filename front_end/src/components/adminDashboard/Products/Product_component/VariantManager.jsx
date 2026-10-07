import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const uid = (prefix = "id") => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

const num = (v) => {
  if (v === "" || v === null || v === undefined) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const slug = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const createValue = (name = "") => ({
  id: uid("value"),
  name,
  image: "",
  imageSource: "none", // none | url | upload
  propertyId: null,
});

const createOption = (name = "") => ({
  id: uid("option"),
  name,
  values: [],
});

const createVariant = (attributes = {}) => ({
  id: uid("variant"),
  sku_attr: "",
  attributes,
  cost: 0,
  sellingPrice: 0,
  comparePrice: 0,
  available_stock: 0,
});

const normalizeLegacyVariant = (variant = {}) => {
  const attrs = {};

  if (variant.attributes && typeof variant.attributes === "object") {
    Object.entries(variant.attributes).forEach(([name, a]) => {
      if (a && typeof a === "object" && !Array.isArray(a)) {
        attrs[name] = {
          value: a.value ?? "",
          definitionName: a.definitionName ?? a.value ?? "",
          valueId: a.valueId ?? null,
          image: a.image ?? a.sku_image ?? "",
          sku_image: a.sku_image ?? a.image ?? "",
          propertyId: a.propertyId ?? null,
        };
      } else {
        attrs[name] = {
          value: a ?? "",
          definitionName: a ?? "",
          valueId: null,
          image: "",
          sku_image: "",
          propertyId: null,
        };
      }
    });
  }

  if (variant.color && !Object.keys(attrs).some((x) => x.toLowerCase() === "color")) {
    attrs.Color = {
      value: variant.color,
      definitionName: variant.color,
      valueId: null,
      image: variant.image ?? variant.sku_image ?? "",
      sku_image: variant.sku_image ?? variant.image ?? "",
      propertyId: null,
    };
  }

  if (variant.size && !Object.keys(attrs).some((x) => x.toLowerCase() === "size")) {
    attrs.Size = {
      value: variant.size,
      definitionName: variant.size,
      valueId: null,
      image: "",
      sku_image: "",
      propertyId: null,
    };
  }

  return {
    ...variant,
    id: variant.id ?? uid("variant"),
    sku_attr: variant.sku_attr ?? "",
    attributes: attrs,
    cost: num(variant.cost),
    sellingPrice: num(variant.sellingPrice),
    comparePrice: num(variant.comparePrice),
    available_stock: num(variant.available_stock),
  };
};

const migrateOptions = (formData) => {
  const existing = Array.isArray(formData?.options) ? formData.options : [];
  const variants = (formData?.skuInfo || []).map(normalizeLegacyVariant);

  if (existing.length) {
    return existing.map((option) => ({
      id: option.id ?? uid("option"),
      name: option.name ?? "",
      values: (option.values || []).map((value) => {
        const matchingVariantAttribute = variants
          .map((variant) => {
            const direct = variant.attributes?.[option.name];

            if (direct) return direct;

            return Object.entries(variant.attributes || {}).find(
              ([name]) =>
                name.toLowerCase() === option.name.toLowerCase()
            )?.[1];
          })
          .find((attr) => {
            if (!attr) return false;

            if (attr.valueId && value.id) {
              return attr.valueId === value.id;
            }

            return (
              String(attr.value ?? attr.definitionName ?? "")
                .trim()
                .toLowerCase() === value.name.trim().toLowerCase()
            );
          });

        return {
          ...createValue(value.name ?? ""),
          ...value,
          id: value.id ?? uid("value"),
          name: value.name ?? "",
          image: value.image ?? "",
          imageSource:
            value.imageSource ?? (value.image ? "url" : "none"),

          // Backfill the value's propertyId from existing SKU data.
          propertyId:
            value.propertyId ??
            matchingVariantAttribute?.propertyId ??
            null,
        };
      }),
    }));
  }

  const byName = new Map();

  variants.forEach((variant) => {
    Object.entries(variant.attributes || {}).forEach(([name, attr]) => {
      if (!byName.has(name)) byName.set(name, []);
      const list = byName.get(name);
      const valueName = attr?.value ?? attr?.definitionName ?? "";
      if (!valueName) return;

      const already = list.find(
        (v) =>
          v.name.trim().toLowerCase() ===
          String(valueName).trim().toLowerCase()
      );

      if (!already) {
        list.push({
          ...createValue(valueName),
          id: attr?.valueId ?? uid("value"),
          image: attr?.image ?? attr?.sku_image ?? "",
          imageSource: attr?.image || attr?.sku_image ? "url" : "none",
          propertyId: attr?.propertyId ?? null,
        });
      }
    });
  });

  return Array.from(byName.entries()).map(([name, values]) => ({
    id: uid("option"),
    name,
    values,
  }));
};

export default function VariantManager({
  formData,
  setFormData,
  onImageUpload,
  maxOptions = 3,
}) {
  const fileInputs = useRef({});
  const [openOption, setOpenOption] = useState(null);
  const [newOptionName, setNewOptionName] = useState("");
  const [newValueNames, setNewValueNames] = useState({});
  const [imageMenu, setImageMenu] = useState(null);
  const [notice, setNotice] = useState("");

  const options = useMemo(
    () => migrateOptions(formData || {}),
    [formData?.options]
  );

  const variants = useMemo(
    () => (formData?.skuInfo || []).map(normalizeLegacyVariant),
    [formData?.skuInfo]
  );

  useEffect(() => {
    if (!formData) return;

    const current = Array.isArray(formData.options) ? formData.options : null;
    if (!current) {
      setFormData((prev) => ({
        ...prev,
        options,
        skuInfo: variants,
      }));
    }
  }, []); // initialize only once

  /*
   * IMPORTANT:
   * The option value is the source of truth for propertyId.
   * Before anything is written to formData.skuInfo, copy the
   * option value metadata into every matching variant attribute.
   *
   * This guarantees:
   * options[].values[].propertyId
   *        ↓
   * skuInfo[].attributes[optionName].propertyId
   */
  const hydrateVariantMetadata = (nextOptions, nextVariants = []) => {
    return nextVariants.map((variant) => {
      const attributes = {};

      nextOptions.forEach((option) => {
        const attr =
          variant.attributes?.[option.name] ||
          Object.entries(variant.attributes || {}).find(
            ([name]) => name.toLowerCase() === option.name.toLowerCase()
          )?.[1];

        if (!attr) return;

        const matchedValue =
          (attr.valueId &&
            option.values.find((value) => value.id === attr.valueId)) ||
          option.values.find(
            (value) =>
              value.name.trim().toLowerCase() ===
              String(attr.value ?? attr.definitionName ?? "")
                .trim()
                .toLowerCase()
          );

        if (!matchedValue) {
          attributes[option.name] = { ...attr };
          return;
        }

        attributes[option.name] = {
          ...attr,
          value: matchedValue.name,
          definitionName: matchedValue.name,
          valueId: matchedValue.id,
          propertyId: matchedValue.propertyId ?? attr.propertyId ?? null,
          image: matchedValue.image || attr.image || attr.sku_image || "",
          sku_image:
            matchedValue.image || attr.sku_image || attr.image || "",
        };
      });

      return {
        ...variant,
        attributes,
      };
    });
  };

  const persist = (nextOptions, nextVariants = variants) => {
    const hydratedVariants = hydrateVariantMetadata(
      nextOptions,
      nextVariants
    );

    setFormData((prev) => ({
      ...prev,
      options: nextOptions,
      skuInfo: hydratedVariants,
    }));
  };

  const showNotice = (message) => {
    setNotice(message);
    window.clearTimeout(showNotice.timer);
    showNotice.timer = window.setTimeout(() => setNotice(""), 2200);
  };

  const optionById = (id) => options.find((o) => o.id === id);

  const findValue = (optionId, valueId) =>
    optionById(optionId)?.values.find((v) => v.id === valueId);

  const buildAttribute = (option, value) => ({
    value: value.name,
    definitionName: value.name,
    valueId: value.id,

    // Critical: this is copied from the option value into the SKU.
    propertyId:
      value.propertyId !== undefined && value.propertyId !== null
        ? value.propertyId
        : null,

    image: value.image || "",
    sku_image: value.image || "",
  });

  const combinationKey = (attributes) =>
    options
      .map((option) => attributes?.[option.name]?.valueId || "")
      .join("::");

  const generateCombinations = (sourceOptions = options, oldVariants = variants) => {
    const usable = sourceOptions.filter((o) => o.name.trim() && o.values.length);

    if (!usable.length) return oldVariants.length ? oldVariants : [createVariant({})];

    let combinations = [{}];

    usable.forEach((option) => {
      const next = [];
      combinations.forEach((base) => {
        option.values.forEach((value) => {
          next.push({
            ...base,
            [option.name]: buildAttribute(option, value),
          });
        });
      });
      combinations = next;
    });

    const oldMap = new Map(
      oldVariants.map((variant) => [combinationKey(variant.attributes), variant])
    );

    return combinations.map((attributes) => {
      const key = combinationKey(attributes);
      const old = oldMap.get(key);

      return old
        ? {
            ...old,
            attributes,
          }
        : createVariant(attributes);
    });
  };

  const addOption = () => {
    const name = newOptionName.trim();
    if (!name) return;

    if (options.some((o) => o.name.toLowerCase() === name.toLowerCase())) {
      showNotice("This option already exists.");
      return;
    }

    if (options.length >= maxOptions) {
      showNotice(`You can use up to ${maxOptions} options.`);
      return;
    }

    const option = createOption(name);
    const next = [...options, option];
    setNewOptionName("");
    setOpenOption(option.id);
    persist(next, variants);
  };

  const removeOption = (optionId) => {
    const option = optionById(optionId);
    if (!option) return;

    const nextOptions = options.filter((o) => o.id !== optionId);
    const nextVariants = nextOptions.every((o) => o.values.length)
      ? generateCombinations(nextOptions, variants)
      : [];

    persist(nextOptions, nextVariants);
    if (openOption === optionId) setOpenOption(null);
  };

  const renameOption = (optionId, name) => {
    const clean = name.trim();
    if (!clean) return;

    const option = optionById(optionId);
    if (!option) return;

    const nextOptions = options.map((o) =>
      o.id === optionId ? { ...o, name: clean } : o
    );

    const nextVariants = variants.map((variant) => {
      const oldAttr = variant.attributes?.[option.name];
      if (!oldAttr) return variant;

      const attributes = { ...variant.attributes };
      delete attributes[option.name];
      attributes[clean] = oldAttr;

      return { ...variant, attributes };
    });

    persist(nextOptions, nextVariants);
  };

  const addValue = (optionId) => {
    const raw = newValueNames[optionId] || "";
    const names = raw
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    if (!names.length) return;

    const option = optionById(optionId);
    if (!option) return;

    const additions = names
      .filter(
        (name, index) =>
          names.findIndex(
            (x) => x.toLowerCase() === name.toLowerCase()
          ) === index &&
          !option.values.some(
            (v) => v.name.toLowerCase() === name.toLowerCase()
          )
      )
      .map(createValue);

    if (!additions.length) {
      showNotice("Those values already exist.");
      return;
    }

    const nextOptions = options.map((o) =>
      o.id === optionId
        ? { ...o, values: [...o.values, ...additions] }
        : o
    );

    const nextVariants =
      nextOptions.every((o) => o.values.length)
        ? generateCombinations(nextOptions, variants)
        : variants;

    setNewValueNames((prev) => ({ ...prev, [optionId]: "" }));
    persist(nextOptions, nextVariants);
  };

  const removeValue = (optionId, valueId) => {
    const nextOptions = options.map((option) =>
      option.id === optionId
        ? { ...option, values: option.values.filter((v) => v.id !== valueId) }
        : option
    );

    const nextVariants =
      nextOptions.every((o) => o.values.length)
        ? generateCombinations(nextOptions, variants)
        : [];

    persist(nextOptions, nextVariants);
  };

  const renameValue = (optionId, valueId, name) => {
    const clean = name.trim();
    if (!clean) return;

    const option = optionById(optionId);
    const value = findValue(optionId, valueId);
    if (!option || !value) return;

    const nextOptions = options.map((o) =>
      o.id === optionId
        ? {
            ...o,
            values: o.values.map((v) =>
              v.id === valueId ? { ...v, name: clean } : v
            ),
          }
        : o
    );

    const nextVariants = variants.map((variant) => {
      const attr = variant.attributes?.[option.name];
      if (attr?.valueId !== valueId) return variant;

      return {
        ...variant,
        attributes: {
          ...variant.attributes,
          [option.name]: {
            ...attr,
            value: clean,
            definitionName: clean,
          },
        },
      };
    });

    persist(nextOptions, nextVariants);
  };

  const setValueImage = async (optionId, valueId, image, source = "url") => {
    const nextOptions = options.map((option) =>
      option.id === optionId
        ? {
            ...option,
            values: option.values.map((value) =>
              value.id === valueId
                ? { ...value, image, imageSource: source }
                : value
            ),
          }
        : option
    );

    const option = optionById(optionId);
    const nextVariants = variants.map((variant) => {
      const attr = variant.attributes?.[option?.name];
      if (attr?.valueId !== valueId) return variant;

      return {
        ...variant,
        attributes: {
          ...variant.attributes,
          [option.name]: {
            ...attr,
            image,
            sku_image: image,
          },
        },
      };
    });

    persist(nextOptions, nextVariants);
  };

  const handleFile = async (optionId, valueId, file) => {
    if (!file) return;

    try {
      let result = "";

      if (onImageUpload) {
        result = await onImageUpload(file, {
          optionId,
          valueId,
          option: optionById(optionId)?.name,
          value: findValue(optionId, valueId)?.name,
        });

        if (typeof result === "object") {
          result = result.url || result.secure_url || result.path || "";
        }
      }

      if (!result) {
        result = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      await setValueImage(optionId, valueId, result, "upload");
      showNotice("Image added.");
    } catch (error) {
      console.error(error);
      showNotice("Image upload failed.");
    }

    setImageMenu(null);
  };

  const updateVariant = (id, field, value) => {
    const next = variants.map((variant) =>
      variant.id === id ? { ...variant, [field]: value } : variant
    );
    persist(options, next);
  };

  const duplicateVariant = (id) => {
    const source = variants.find((v) => v.id === id);
    if (!source) return;

    const copy = {
      ...source,
      id: uid("variant"),
      sku_attr: "",
      attributes: Object.fromEntries(
        Object.entries(source.attributes || {}).map(([key, value]) => [
          key,
          { ...value },
        ])
      ),
    };

    const index = variants.findIndex((v) => v.id === id);
    const next = [...variants];
    next.splice(index + 1, 0, copy);
    persist(options, next);
  };

  const deleteVariant = (id) => {
    persist(
      options,
      variants.filter((variant) => variant.id !== id)
    );
  };

  const regenerate = () => {
    if (!options.length || options.some((o) => !o.values.length)) {
      showNotice("Add at least one value to every option first.");
      return;
    }

    persist(options, generateCombinations(options, variants));
    showNotice("Variants updated.");
  };

  const totalStock = variants.reduce(
    (sum, variant) => sum + num(variant.available_stock),
    0
  );

  const optionNames = options.map((o) => o.name);

  return (
    <Wrapper>
      {notice && <Toast>{notice}</Toast>}

      <Header>
        <div>
          <Eyebrow>ENOUZA PRODUCT SETUP</Eyebrow>
          <Title>Options & Variations</Title>
          <Subtitle>
            Set the choices customers can select, then manage each combination,
            price, stock and SKU.
          </Subtitle>
        </div>

        <HeaderStats>
          <Stat>
            <b>{options.length}</b>
            <span>Options</span>
          </Stat>
          <Stat>
            <b>{variants.length}</b>
            <span>Variants</span>
          </Stat>
          <Stat>
            <b>{totalStock}</b>
            <span>Total stock</span>
          </Stat>
        </HeaderStats>
      </Header>

      <Section>
        <SectionHeader>
          <div>
            <SectionTitle>1. Product options</SectionTitle>
            <SectionDescription>
              These are the choices shown to customers, such as Color, Size or
              Finish.
            </SectionDescription>
          </div>
          <SmallMuted>{options.length}/{maxOptions}</SmallMuted>
        </SectionHeader>

        {options.length === 0 && (
          <EmptyOptions>
            <AutoAwesomeIcon />
            <div>
              <strong>No options added yet</strong>
              <span>
                Start with an option such as Color, Size or Finish.
              </span>
            </div>
          </EmptyOptions>
        )}

        <OptionList>
          {options.map((option, optionIndex) => {
            const expanded = openOption === option.id;

            return (
              <OptionCard key={option.id}>
                <OptionHeader
                  type="button"
                  onClick={() =>
                    setOpenOption(expanded ? null : option.id)
                  }
                >
                  <OptionNumber>{optionIndex + 1}</OptionNumber>

                  <OptionHeading>
                    <strong>{option.name || "Untitled option"}</strong>
                    <span>
                      {option.values.length
                        ? `${option.values.length} value${
                            option.values.length === 1 ? "" : "s"
                          }`
                        : "Add values below"}
                    </span>
                  </OptionHeading>

                  <ExpandMoreIcon
                    style={{
                      transform: expanded ? "rotate(180deg)" : "rotate(0)",
                    }}
                  />
                </OptionHeader>

                {expanded && (
                  <OptionBody>
                    <FieldLabel>Option name</FieldLabel>
                    <OptionNameInput
                      value={option.name}
                      onChange={(e) =>
                        renameOption(option.id, e.target.value)
                      }
                      onBlur={(e) =>
                        renameOption(option.id, e.target.value)
                      }
                    />

                    <FieldLabel>Values</FieldLabel>

                    <Values>
                      {option.values.map((value) => (
                        <ValueRow key={value.id}>
                          <ValueThumb>
                            {value.image ? (
                              <img src={value.image} alt="" />
                            ) : (
                              <ImageOutlinedIcon fontSize="small" />
                            )}
                          </ValueThumb>

                          <ValueName
                            value={value.name}
                            onChange={(e) =>
                              renameValue(
                                option.id,
                                value.id,
                                e.target.value
                              )
                            }
                            onBlur={(e) =>
                              renameValue(
                                option.id,
                                value.id,
                                e.target.value
                              )
                            }
                          />

                          <ImageControl>
                            <ImageButton
                              type="button"
                              onClick={() =>
                                setImageMenu(
                                  imageMenu === value.id ? null : value.id
                                )
                              }
                            >
                              {value.image ? "Change image" : "Add image"}
                              <ExpandMoreIcon fontSize="small" />
                            </ImageButton>

                            {imageMenu === value.id && (
                              <ImageMenu>
                                <MenuTitle>Value image</MenuTitle>

                                <MenuItem
                                  type="button"
                                  onClick={() => {
                                    const url = window.prompt(
                                      "Paste image URL:",
                                      value.image || ""
                                    );
                                    if (url !== null) {
                                      setValueImage(
                                        option.id,
                                        value.id,
                                        url.trim(),
                                        "url"
                                      );
                                    }
                                    setImageMenu(null);
                                  }}
                                >
                                  <ImageOutlinedIcon fontSize="small" />
                                  Image URL
                                </MenuItem>

                                <MenuItem
                                  type="button"
                                  onClick={() => {
                                    fileInputs.current[value.id]?.click();
                                  }}
                                >
                                  <UploadFileIcon fontSize="small" />
                                  Upload image
                                </MenuItem>

                                {value.image && (
                                  <MenuItem
                                    danger
                                    type="button"
                                    onClick={() => {
                                      setValueImage(
                                        option.id,
                                        value.id,
                                        "",
                                        "none"
                                      );
                                      setImageMenu(null);
                                    }}
                                  >
                                    <CloseIcon fontSize="small" />
                                    Remove image
                                  </MenuItem>
                                )}
                              </ImageMenu>
                            )}

                            <input
                              ref={(el) => {
                                fileInputs.current[value.id] = el;
                              }}
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={(e) =>
                                handleFile(
                                  option.id,
                                  value.id,
                                  e.target.files?.[0]
                                )
                              }
                            />
                          </ImageControl>

                          <RemoveValue
                            type="button"
                            onClick={() =>
                              removeValue(option.id, value.id)
                            }
                            aria-label="Remove value"
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </RemoveValue>
                        </ValueRow>
                      ))}
                    </Values>

                    <AddValueRow>
                      <ValueInput
                        value={newValueNames[option.id] || ""}
                        placeholder="Add values, separated by commas"
                        onChange={(e) =>
                          setNewValueNames((prev) => ({
                            ...prev,
                            [option.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addValue(option.id);
                          }
                        }}
                      />

                      <AddValueButton
                        type="button"
                        onClick={() => addValue(option.id)}
                      >
                        <AddIcon fontSize="small" />
                        Add
                      </AddValueButton>
                    </AddValueRow>

                    <OptionFooter>
                      <DangerButton
                        type="button"
                        onClick={() => removeOption(option.id)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                        Remove option
                      </DangerButton>
                    </OptionFooter>
                  </OptionBody>
                )}
              </OptionCard>
            );
          })}
        </OptionList>

        {options.length < maxOptions && (
          <AddOptionBox>
            <OptionNameInput
              value={newOptionName}
              placeholder="Option name (Color, Size, Finish...)"
              onChange={(e) => setNewOptionName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addOption();
                }
              }}
            />
            <PrimaryButton type="button" onClick={addOption}>
              <AddIcon fontSize="small" />
              Add option
            </PrimaryButton>
          </AddOptionBox>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <div>
            <SectionTitle>2. Variations</SectionTitle>
            <SectionDescription>
              Each combination below represents one sellable product variant.
            </SectionDescription>
          </div>

          <PrimaryButton type="button" onClick={regenerate}>
            Generate combinations
          </PrimaryButton>
        </SectionHeader>

        {variants.length === 0 ? (
          <EmptyVariants>
            <AutoAwesomeIcon />
            <strong>Add option values to generate your variants.</strong>
            <span>
              For example, Black + Small and Gold + Large become separate
              inventory items.
            </span>
          </EmptyVariants>
        ) : (
          <>
            <DesktopTable>
              <table>
                <thead>
                  <tr>
                    <th>Combination</th>
                    <th>SKU</th>
                    <th>Cost</th>
                    <th>Selling price</th>
                    <th>Compare at</th>
                    <th>Stock</th>
                    <th>Profit</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {variants.map((variant) => (
                    <tr key={variant.id}>
                      <td>
                        <Combination>
                          {optionNames.map((name) => {
                            const attr = variant.attributes?.[name];
                            return (
                              <Pill key={name}>
                                <b>{name}:</b>{" "}
                                {attr?.definitionName || attr?.value || "—"}
                              </Pill>
                            );
                          })}
                        </Combination>
                      </td>

                      <td>
                        <TableInput
                          value={variant.sku_attr}
                          placeholder="SKU"
                          onChange={(e) =>
                            updateVariant(
                              variant.id,
                              "sku_attr",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        <NumberInput
                          value={variant.cost}
                          type="number"
                          min="0"
                          step="0.01"
                          onChange={(e) =>
                            updateVariant(
                              variant.id,
                              "cost",
                              e.target.value === "" ? "" : num(e.target.value)
                            )
                          }
                        />
                      </td>

                      <td>
                        <NumberInput
                          value={variant.sellingPrice}
                          type="number"
                          min="0"
                          step="0.01"
                          onChange={(e) =>
                            updateVariant(
                              variant.id,
                              "sellingPrice",
                              e.target.value === "" ? "" : num(e.target.value)
                            )
                          }
                        />
                      </td>

                      <td>
                        <NumberInput
                          value={variant.comparePrice}
                          type="number"
                          min="0"
                          step="0.01"
                          onChange={(e) =>
                            updateVariant(
                              variant.id,
                              "comparePrice",
                              e.target.value === "" ? "" : num(e.target.value)
                            )
                          }
                        />
                      </td>

                      <td>
                        <NumberInput
                          value={variant.available_stock}
                          type="number"
                          min="0"
                          step="1"
                          onChange={(e) =>
                            updateVariant(
                              variant.id,
                              "available_stock",
                              e.target.value === "" ? "" : num(e.target.value)
                            )
                          }
                        />
                      </td>

                      <td>
                        <Profit>
                          €
                          {(
                            num(variant.sellingPrice) - num(variant.cost)
                          ).toFixed(2)}
                        </Profit>
                      </td>

                      <td>
                        <Actions>
                          <IconButton
                            type="button"
                            title="Duplicate"
                            onClick={() => duplicateVariant(variant.id)}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            danger
                            type="button"
                            title="Delete"
                            onClick={() => deleteVariant(variant.id)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Actions>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DesktopTable>

            <MobileVariants>
              {variants.map((variant, index) => (
                <MobileCard key={variant.id}>
                  <MobileCardTop>
                    <MobileIndex>#{index + 1}</MobileIndex>
                    <Actions>
                      <IconButton
                        type="button"
                        onClick={() => duplicateVariant(variant.id)}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        danger
                        type="button"
                        onClick={() => deleteVariant(variant.id)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Actions>
                  </MobileCardTop>

                  <Combination>
                    {optionNames.map((name) => {
                      const attr = variant.attributes?.[name];
                      const value = findValue(
                        options.find((o) => o.name === name)?.id,
                        attr?.valueId
                      );

                      return (
                        <MobileOption key={name}>
                          {value?.image && <img src={value.image} alt="" />}
                          <span>
                            <b>{name}</b>
                            {attr?.definitionName || attr?.value || "—"}
                          </span>
                        </MobileOption>
                      );
                    })}
                  </Combination>

                  <MobileGrid>
                    <MobileField>
                      <label>SKU</label>
                      <TableInput
                        value={variant.sku_attr}
                        placeholder="SKU"
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "sku_attr",
                            e.target.value
                          )
                        }
                      />
                    </MobileField>

                    <MobileField>
                      <label>Stock</label>
                      <NumberInput
                        value={variant.available_stock}
                        type="number"
                        min="0"
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "available_stock",
                            e.target.value === ""
                              ? ""
                              : num(e.target.value)
                          )
                        }
                      />
                    </MobileField>

                    <MobileField>
                      <label>Cost</label>
                      <NumberInput
                        value={variant.cost}
                        type="number"
                        min="0"
                        step="0.01"
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "cost",
                            e.target.value === "" ? "" : num(e.target.value)
                          )
                        }
                      />
                    </MobileField>

                    <MobileField>
                      <label>Selling</label>
                      <NumberInput
                        value={variant.sellingPrice}
                        type="number"
                        min="0"
                        step="0.01"
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "sellingPrice",
                            e.target.value === "" ? "" : num(e.target.value)
                          )
                        }
                      />
                    </MobileField>

                    <MobileField>
                      <label>Compare</label>
                      <NumberInput
                        value={variant.comparePrice}
                        type="number"
                        min="0"
                        step="0.01"
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "comparePrice",
                            e.target.value === "" ? "" : num(e.target.value)
                          )
                        }
                      />
                    </MobileField>

                    <MobileField>
                      <label>Profit</label>
                      <Profit>
                        €
                        {(
                          num(variant.sellingPrice) - num(variant.cost)
                        ).toFixed(2)}
                      </Profit>
                    </MobileField>
                  </MobileGrid>
                </MobileCard>
              ))}
            </MobileVariants>
          </>
        )}
      </Section>
    </Wrapper>
  );
}

/* =========================================================
   STYLES
========================================================= */

const Wrapper = styled.div`
  --ink: #24211d;
  --muted: #77716a;
  --line: #e7e1d9;
  --soft: #faf8f5;
  --cream: #f5f0e8;
  --gold: #9b815f;
  --gold-dark: #806747;
  --danger: #9a4e43;

  width: 100%;
  color: var(--ink);
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 24px;

  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const Eyebrow = styled.div`
  color: var(--gold);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  margin-bottom: 8px;
`;

const Title = styled.h2`
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(25px, 4vw, 36px);
  font-weight: 500;
  letter-spacing: -0.025em;
`;

const Subtitle = styled.p`
  max-width: 680px;
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
`;

const HeaderStats = styled.div`
  display: flex;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: white;
  overflow: hidden;
`;

const Stat = styled.div`
  min-width: 88px;
  padding: 12px 16px;
  text-align: center;
  border-left: 1px solid var(--line);

  &:first-child {
    border-left: 0;
  }

  b {
    display: block;
    font-size: 18px;
  }

  span {
    display: block;
    margin-top: 3px;
    color: var(--muted);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  @media (max-width: 480px) {
    min-width: 76px;
    padding: 10px;
  }
`;

const Section = styled.section`
  margin-bottom: 20px;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: white;

  @media (max-width: 600px) {
    padding: 16px;
    border-radius: 15px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;

  @media (max-width: 600px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 750;
`;

const SectionDescription = styled.p`
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.5;
`;

const SmallMuted = styled.span`
  color: var(--muted);
  font-size: 12px;
`;

const OptionList = styled.div`
  display: grid;
  gap: 12px;
`;

const OptionCard = styled.div`
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: visible;
  background: var(--soft);
`;

const OptionHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 0;
  background: transparent;
  color: var(--ink);
  text-align: left;
  cursor: pointer;

  svg {
    margin-left: auto;
    transition: transform 0.2s ease;
  }
`;

const OptionNumber = styled.span`
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--cream);
  color: var(--gold-dark);
  font-size: 12px;
  font-weight: 800;
`;

const OptionHeading = styled.div`
  display: grid;
  gap: 3px;

  strong {
    font-size: 14px;
  }

  span {
    color: var(--muted);
    font-size: 11px;
  }
`;

const OptionBody = styled.div`
  padding: 0 14px 15px;
  border-top: 1px solid var(--line);
`;

const FieldLabel = styled.label`
  display: block;
  margin: 15px 0 7px;
  color: #5d574f;
  font-size: 11px;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: 0.07em;
`;

const OptionNameInput = styled.input`
  width: 100%;
  min-height: 42px;
  box-sizing: border-box;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: white;
  color: var(--ink);
  outline: none;
  font-size: 13px;

  &:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(155, 129, 95, 0.1);
  }
`;

const Values = styled.div`
  display: grid;
  gap: 7px;
`;

const ValueRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: white;

  @media (max-width: 600px) {
    flex-wrap: wrap;
  }
`;

const ValueThumb = styled.div`
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--soft);
  color: #aaa;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ValueName = styled.input`
  min-width: 100px;
  flex: 1;
  height: 36px;
  padding: 0 8px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ink);
  font-size: 13px;
`;

const ImageControl = styled.div`
  position: relative;
`;

const ImageButton = styled.button`
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 9px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: white;
  color: #5f574d;
  font-size: 11px;
  cursor: pointer;

  &:hover {
    border-color: var(--gold);
  }
`;

const ImageMenu = styled.div`
  position: absolute;
  z-index: 30;
  top: calc(100% + 6px);
  right: 0;
  width: 190px;
  padding: 6px;
  border: 1px solid var(--line);
  border-radius: 11px;
  background: white;
  box-shadow: 0 14px 35px rgba(34, 27, 19, 0.14);
`;

const MenuTitle = styled.div`
  padding: 7px 9px;
  color: var(--muted);
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: ${(p) => (p.danger ? "var(--danger)" : "var(--ink)")};
  text-align: left;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: var(--soft);
  }
`;

const RemoveValue = styled.button`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #8a8178;
  cursor: pointer;

  &:hover {
    color: var(--danger);
    background: #fbf1ef;
  }
`;

const AddValueRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 9px;

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;

const ValueInput = styled.input`
  min-height: 40px;
  flex: 1;
  padding: 0 11px;
  border: 1px solid var(--line);
  border-radius: 8px;
  outline: none;
  background: white;
  font-size: 12px;

  &:focus {
    border-color: var(--gold);
  }
`;

const AddValueButton = styled.button`
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 13px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: white;
  color: var(--ink);
  font-weight: 700;
  cursor: pointer;

  &:hover {
    border-color: var(--gold);
  }
`;

const OptionFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 13px;
`;

const DangerButton = styled.button`
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0 9px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--danger);
  font-size: 11px;
  cursor: pointer;

  &:hover {
    background: #fbf1ef;
  }
`;

const AddOptionBox = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding: 10px;
  border: 1px dashed #d9d0c5;
  border-radius: 12px;
  background: #fdfcfb;

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;

const EmptyOptions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px dashed #ddd4c9;
  border-radius: 12px;
  background: #fdfcfb;
  color: var(--gold);

  div {
    display: grid;
    gap: 3px;
  }

  strong {
    color: var(--ink);
    font-size: 13px;
  }

  span {
    color: var(--muted);
    font-size: 11px;
  }
`;

const EmptyVariants = styled.div`
  display: grid;
  justify-items: center;
  gap: 6px;
  padding: 35px 20px;
  border: 1px dashed #ddd4c9;
  border-radius: 13px;
  background: #fdfcfb;
  text-align: center;

  svg {
    color: var(--gold);
    margin-bottom: 4px;
  }

  strong {
    font-size: 13px;
  }

  span {
    color: var(--muted);
    font-size: 11px;
  }
`;

const PrimaryButton = styled.button`
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 14px;
  border: 1px solid var(--gold-dark);
  border-radius: 9px;
  background: var(--gold-dark);
  color: white;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #6f593d;
  }
`;

const DesktopTable = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 12px;

  table {
    width: 100%;
    min-width: 980px;
    border-collapse: collapse;
  }

  th {
    padding: 11px 10px;
    border-bottom: 1px solid var(--line);
    background: var(--soft);
    color: #71695f;
    font-size: 10px;
    font-weight: 800;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }

  td {
    padding: 9px 10px;
    border-bottom: 1px solid #eee9e3;
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: 0;
  }

  @media (max-width: 800px) {
    display: none;
  }
`;

const Combination = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  min-width: 190px;
`;

const Pill = styled.span`
  padding: 5px 7px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--soft);
  color: #5d574f;
  font-size: 10px;
  white-space: nowrap;

  b {
    color: var(--ink);
  }
`;

const TableInput = styled.input`
  width: 105px;
  height: 35px;
  box-sizing: border-box;
  padding: 0 8px;
  border: 1px solid var(--line);
  border-radius: 7px;
  outline: 0;
  background: white;
  color: var(--ink);
  font-size: 11px;

  &:focus {
    border-color: var(--gold);
  }
`;

const NumberInput = styled.input`
  width: 82px;
  height: 35px;
  box-sizing: border-box;
  padding: 0 8px;
  border: 1px solid var(--line);
  border-radius: 7px;
  outline: 0;
  background: white;
  color: var(--ink);
  font-size: 11px;

  &:focus {
    border-color: var(--gold);
  }
`;

const Profit = styled.span`
  color: ${(p) => (p.positive === false ? "#9a4e43" : "#5d7659")};
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const IconButton = styled.button`
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: ${(p) => (p.danger ? "#8e5047" : "#71695f")};
  cursor: pointer;

  &:hover {
    background: ${(p) => (p.danger ? "#fbf1ef" : "#f3eee8")};
  }
`;

const MobileVariants = styled.div`
  display: none;

  @media (max-width: 800px) {
    display: grid;
    gap: 10px;
  }
`;

const MobileCard = styled.div`
  padding: 13px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--soft);
`;

const MobileCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const MobileIndex = styled.span`
  color: var(--muted);
  font-size: 11px;
  font-weight: 800;
`;

const MobileOption = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 5px;
  color: #5d574f;
  font-size: 11px;

  img {
    width: 24px;
    height: 24px;
    object-fit: cover;
    border-radius: 5px;
    border: 1px solid var(--line);
  }

  span {
    display: flex;
    gap: 5px;
  }

  b {
    color: var(--ink);
  }
`;

const MobileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 12px;
`;

const MobileField = styled.div`
  display: grid;
  gap: 4px;

  label {
    color: var(--muted);
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  input {
    width: 100%;
  }
`;

const Toast = styled.div`
  position: fixed;
  z-index: 100;
  right: 22px;
  bottom: 22px;
  max-width: calc(100vw - 44px);
  padding: 11px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #26231f;
  color: white;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
  font-size: 12px;
  font-weight: 650;
`;
