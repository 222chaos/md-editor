﻿import {
  BoldOutlined,
  ClearOutlined,
  ItalicOutlined,
  LinkOutlined,
  PlusCircleFilled,
  RedoOutlined,
  StrikethroughOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { ColorPicker, Divider, Dropdown, Tooltip } from 'antd';
import classnames from 'classnames';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Editor, Element, NodeEntry } from 'slate';
import { useEditorStore } from '../../store';
import { EditorUtils } from '../../utils/editorUtils';
import { getInsertOptions } from '../InsertAutocomplete';

const HeatTextMap = {
  1: '大标题',
  2: '段落标题',
  3: '小标题',
  4: '正文',
};

const LineCode = () => {
  return (
    <svg viewBox="0 0 1024 1024" version="1.1" width="1.3em" height="1.3em">
      <path
        fill="currentColor"
        d="M153.770667 517.558857l200.387047-197.241905L302.86019 268.190476 48.761905 518.290286l254.439619 243.614476 50.590476-52.833524-200.021333-191.512381zM658.285714 320.316952L709.583238 268.190476l254.098286 250.09981L709.241905 761.904762l-50.590476-52.833524 200.021333-191.512381L658.285714 320.316952z m-112.981333-86.186666L393.99619 785.554286l70.534096 19.358476 151.30819-551.399619-70.534095-19.358476z"
      />
    </svg>
  );
};

const tools = [
  {
    key: 'bold',
    type: 'bold',
    title: '加粗 Bold',
    icon: (<BoldOutlined />) as React.ReactNode,
  },
  {
    key: 'italic',
    title: '斜体  Italic',
    type: 'italic',
    icon: <ItalicOutlined />,
  },
  {
    key: 'strikethrough',
    title: '删除线  Strikethrough',
    type: 'strikethrough',
    icon: <StrikethroughOutlined />,
  },
  {
    key: 'inline-code',
    title: '行内代码 Inline Code ',
    type: 'code',
    icon: <LineCode />,
  },
];

const colors = [
  { color: 'rgba(16,185,129,1)' },
  { color: 'rgba(245,158,11,1)' },
  { color: 'rgba(59,130,246,1)' },
  { color: 'rgba(156,163,175,.8)' },
  { color: 'rgba(99,102, 241,1)' },
  { color: 'rgba(244,63,94,1)' },
  { color: 'rgba(217,70,239,1)' },
  { color: 'rgba(14, 165, 233, 1)' },
];

export type ToolsKeyType =
  | 'redo'
  | 'undo'
  | 'clear'
  | 'head'
  | 'divider'
  | 'color'
  | 'table'
  | 'column'
  | 'quote'
  | 'code'
  | 'b-list'
  | 'n-list'
  | 't-list'
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'inline-code'
  | 'divider'
  | 'H1'
  | 'H2'
  | 'H3'
  | 'link';

/**
 * 基础工具栏
 * @param props
 * @returns
 */
export const BaseToolBar = observer(
  (props: {
    prefix?: string;
    showInsertAction?: boolean;
    extra?: React.ReactNode[];
    min?: boolean;
    readonly?: boolean;
    hashId?: string;
    hideTools?: ToolsKeyType[];
    showEditor?: boolean;
  }) => {
    const baseClassName = props.prefix || `toolbar-action`;
    const { hashId } = props;

    const { store, markdownEditorRef, keyTask$, editorProps } =
      useEditorStore();

    const [, setRefresh] = React.useState(false);
    const [highColor, setHighColor] = React.useState<string | null>(null);

    const el = useRef<NodeEntry<any>>();

    const openLink = useCallback(() => {
      const sel = markdownEditorRef.current?.selection;
      if (!sel) return;
      el.current = Editor.parent(markdownEditorRef.current, sel.focus.path);
      store.openInsertLink$.next(sel);
      runInAction(() => {
        if (typeof window === 'undefined') return;
        if (typeof window.matchMedia === 'undefined') return;
        store.openLinkPanel = true;
      });
    }, []);

    useEffect(() => {
      setRefresh((r) => !r);
    }, [store.refreshFloatBar]);

    /**
     * 获取当前节点
     */
    const [node] = Editor.nodes<any>(markdownEditorRef.current, {
      match: (n) => Element.isElement(n),
      mode: 'lowest',
    });

    /**
     * 插入操作，一般而言不需要作什么特殊设置
     */
    const insert = useCallback((op: any) => {
      if (!op) {
        return;
      }
      keyTask$.next({
        key: op.task,
        args: op.args,
      });
    }, []);

    useEffect(() => {
      if (typeof localStorage === 'undefined') return undefined;
      setHighColor(localStorage.getItem('high-color'));
    }, [EditorUtils.isFormatActive(markdownEditorRef.current, 'highColor')]);

    const insertOptions = useMemo(
      () =>
        props.showInsertAction
          ? getInsertOptions({
              isTop: false,
            })
              .map((o) => o?.children)
              .flat(1)
              .filter((o) => {
                if (!editorProps?.image && o.task === 'uploadImage') {
                  return false;
                }
                return true;
              })
          : [],
      [editorProps],
    );

    const listDom = useMemo(() => {
      const options = insertOptions.map((t) => {
        return (
          <Tooltip title={t.label.join(' ')} key={t.key}>
            <div
              role="button"
              key={t.key}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                insert(t);
              }}
              className={classnames(`${baseClassName}-item`, hashId)}
            >
              {t.icon}
            </div>
          </Tooltip>
        );
      });

      let list = [];

      if (props.showEditor) {
        list.push(
          <Tooltip title="撤销" key="undo">
            <div
              role="button"
              className={classnames(`${baseClassName}-item`, hashId)}
              onClick={() => {
                keyTask$.next({
                  key: 'undo',
                  args: [],
                });
              }}
            >
              <UndoOutlined />
            </div>
          </Tooltip>,
        );

        list.push(
          <Tooltip title="重做" key="重做">
            <div
              role="button"
              key="redo"
              className={classnames(`${baseClassName}-item`, hashId)}
              onClick={() => {
                keyTask$.next({
                  key: 'redo',
                  args: [],
                });
              }}
            >
              <RedoOutlined />
            </div>
          </Tooltip>,
        );
      }

      list.push(
        <Tooltip title="清除格式" key="clear">
          <div
            role="button"
            key="clear"
            className={classnames(`${baseClassName}-item`, hashId)}
            onClick={() => {
              EditorUtils.clearMarks(markdownEditorRef.current, true);
              EditorUtils.highColor(markdownEditorRef.current);
            }}
          >
            <ClearOutlined />
          </div>
        </Tooltip>,
      );

      if (['head', 'paragraph'].includes(node?.[0]?.type)) {
        list.push(
          <Dropdown
            key="head"
            menu={{
              items: ['H1', 'H2', 'H3', 'Text'].map((item, index) => {
                if (props.hideTools && props.hideTools.includes(item as 'H1')) {
                  return null;
                }
                return {
                  label: HeatTextMap[item.replace('H', '') as '1'] || item,
                  key: item,
                  onClick: () => {
                    keyTask$.next({
                      key: 'head',
                      args: [index + 1],
                    });
                  },
                };
              }),
            }}
          >
            <div
              role="button"
              className={classnames(`${baseClassName}-item`, hashId)}
              style={{
                minWidth: 36,
                textAlign: 'center',
                fontSize: 12,
                justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              {node?.[0]?.level
                ? `${
                    HeatTextMap[(node[0].level + '') as '1'] ||
                    `H${node[0].level}`
                  }`
                : '正文'}
            </div>
          </Dropdown>,
        );
      }
      if (list.length > 0) {
        list.push(
          <Divider
            key="divider1"
            type="vertical"
            style={{
              margin: '0 4px',
              height: '18px',
              borderColor: 'rgba(0,0,0,0.15)',
            }}
          />,
        );
      }

      list.push(
        <Tooltip title="字体颜色" key="color">
          <div
            key="color"
            role="button"
            className={classnames(`${baseClassName}-item`, hashId)}
            style={{
              position: 'relative',
            }}
          >
            <ColorPicker
              style={{
                position: 'absolute',
                opacity: 0,
                top: 0,
                left: 0,
              }}
              size="small"
              value={highColor}
              presets={[
                {
                  label: 'Colors',
                  colors: colors.map((c) => c.color),
                },
              ]}
              onChange={(e) => {
                localStorage.setItem('high-color', e.toHexString());
                EditorUtils.highColor(
                  markdownEditorRef.current,
                  e.toHexString(),
                );
                setHighColor(e.toHexString());
                setRefresh((r) => !r);
              }}
            />
            <div
              style={{
                display: 'flex',
                height: '100%',
                alignItems: 'center',
                fontWeight: EditorUtils.isFormatActive(
                  markdownEditorRef.current,
                  'highColor',
                )
                  ? 'bold'
                  : undefined,
                textDecoration: 'underline solid ' + highColor,
                textDecorationLine: 'underline',
                textDecorationThickness: 2,
                lineHeight: 1,
              }}
              role="button"
              onMouseEnter={(e) => e.stopPropagation()}
              onClick={() => {
                if (
                  EditorUtils.isFormatActive(
                    markdownEditorRef.current,
                    'highColor',
                  )
                ) {
                  EditorUtils.highColor(markdownEditorRef.current);
                } else {
                  EditorUtils.highColor(
                    markdownEditorRef.current,
                    highColor || '#10b981',
                  );
                }
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 16,
                  height: 16,
                  textAlign: 'center',
                  marginTop: -1,
                }}
              >
                A
              </span>
            </div>
          </div>
        </Tooltip>,
      );

      list = list.concat(options);

      tools.forEach((tool) => {
        list.push(
          <Tooltip title={tool.title} key={tool.key}>
            <div
              role="button"
              key={tool.key}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                EditorUtils.toggleFormat(markdownEditorRef.current, tool.type);
              }}
              className={classnames(`${baseClassName}-item`, hashId)}
              style={{
                color: EditorUtils.isFormatActive(
                  markdownEditorRef.current,
                  tool.type,
                )
                  ? '#1677ff'
                  : undefined,
              }}
            >
              {tool.icon}
            </div>
          </Tooltip>,
        );
      });

      if (['head', 'paragraph'].includes(node?.[0]?.type)) {
        list.push(
          <Divider
            key="divider2"
            type="vertical"
            style={{
              margin: '0 4px',
              height: '18px',
              borderColor: 'rgba(0,0,0,0.15)',
            }}
          />,
        );
        list.push(
          <Tooltip title="插入链接" key="link">
            <div
              key="link"
              role="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openLink();
              }}
              className={classnames(`${baseClassName}-item`, hashId)}
              style={{
                color: EditorUtils.isFormatActive(
                  markdownEditorRef.current,
                  'url',
                )
                  ? '#1677ff'
                  : undefined,
              }}
            >
              <LinkOutlined />
            </div>
          </Tooltip>,
        );
      }
      if (props.hideTools) {
        list = list.filter((l) => {
          return !props?.hideTools?.includes(l.key as ToolsKeyType);
        });
      }
      return list;
    }, [insertOptions, props.showEditor, node, props.hideTools]);

    const headDom = (
      <>
        {props.showEditor ? (
          <>
            <Tooltip title="撤销">
              <div
                role="button"
                className={classnames(`${baseClassName}-item`, hashId)}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  keyTask$.next({
                    key: 'undo',
                    args: [],
                  });
                }}
              >
                <UndoOutlined />
              </div>
            </Tooltip>
            <Tooltip title="重做">
              <div
                role="button"
                className={classnames(`${baseClassName}-item`, hashId)}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  keyTask$.next({
                    key: 'redo',
                    args: [],
                  });
                }}
              >
                <RedoOutlined />
              </div>
            </Tooltip>
          </>
        ) : null}
        <Tooltip title="清除格式">
          <div
            role="button"
            className={classnames(`${baseClassName}-item`, hashId)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              EditorUtils.clearMarks(markdownEditorRef.current, true);
              EditorUtils.highColor(markdownEditorRef.current);
            }}
          >
            <ClearOutlined />
          </div>
        </Tooltip>
        {['head', 'paragraph'].includes(node?.[0]?.type) ? (
          <>
            <Divider
              type="vertical"
              style={{
                margin: '0 4px',
                height: '18px',
                borderColor: 'rgba(0,0,0,0.15)',
              }}
              key={'divider'}
            />
            <Dropdown
              menu={{
                items: ['H1', 'H2', 'H3'].map((item, index) => {
                  if (
                    props.hideTools &&
                    props.hideTools.includes(item as 'H1')
                  ) {
                    return null;
                  }
                  return {
                    label: HeatTextMap[item.replace('H', '') as '1'] || item,
                    key: item,
                    onClick: () => {
                      keyTask$.next({
                        key: 'head',
                        args: [index + 1],
                      });
                    },
                  };
                }),
              }}
            >
              <Tooltip title="标题">
                <div
                  role="button"
                  className={classnames(`${baseClassName}-item`, hashId)}
                  style={{
                    minWidth: 36,
                    textAlign: 'center',
                    fontSize: node?.[0]?.level ? 14 : 12,
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  {node?.[0]?.level
                    ? `${
                        HeatTextMap[(node[0].level + '') as '1'] ||
                        `H${node[0].level}`
                      }`
                    : '正文'}
                </div>
              </Tooltip>
            </Dropdown>
            <div
              key="color"
              role="button"
              className={classnames(`${baseClassName}-item`, hashId)}
              style={{
                position: 'relative',
              }}
            >
              <ColorPicker
                style={{
                  position: 'absolute',
                  opacity: 0,
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                }}
                size="small"
                value={highColor}
                presets={[
                  {
                    label: 'Colors',
                    colors: colors.map((c) => c.color),
                  },
                ]}
                onChange={(e) => {
                  localStorage.setItem('high-color', e.toHexString());
                  EditorUtils.highColor(
                    markdownEditorRef.current,
                    e.toHexString(),
                  );
                  setHighColor(e.toHexString());
                  setRefresh((r) => !r);
                }}
              />
              <Tooltip title="字体颜色">
                <div
                  style={{
                    display: 'flex',
                    height: '100%',
                    alignItems: 'center',
                    fontWeight: EditorUtils.isFormatActive(
                      markdownEditorRef.current,
                      'highColor',
                    )
                      ? 'bold'
                      : undefined,
                    textDecoration: 'underline solid ' + highColor,
                    textDecorationLine: 'underline',
                    textDecorationThickness: 2,
                    lineHeight: 1,
                  }}
                  role="button"
                  onMouseEnter={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (
                      EditorUtils.isFormatActive(
                        markdownEditorRef.current,
                        'highColor',
                      )
                    ) {
                      EditorUtils.highColor(markdownEditorRef.current);
                    } else {
                      EditorUtils.highColor(
                        markdownEditorRef.current,
                        highColor || '#10b981',
                      );
                    }
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: 16,
                      height: 16,
                      textAlign: 'center',
                      marginTop: -1,
                    }}
                  >
                    A
                  </span>
                </div>
              </Tooltip>
            </div>
            {tools.map((tool) => {
              return (
                <Tooltip key={tool.key} title={tool.title}>
                  <div
                    role="button"
                    key={tool.key}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      EditorUtils.toggleFormat(
                        markdownEditorRef.current,
                        tool.type,
                      );
                    }}
                    className={classnames(`${baseClassName}-item`, hashId)}
                    style={{
                      color: EditorUtils.isFormatActive(
                        markdownEditorRef.current,
                        tool.type,
                      )
                        ? '#1677ff'
                        : undefined,
                    }}
                  >
                    {tool.icon}
                  </div>
                </Tooltip>
              );
            })}
          </>
        ) : null}
      </>
    );

    const minTools = useMemo(() => {
      if (!props.min) return null;
      return (
        <>
          <div
            role="button"
            className={classnames(
              `${baseClassName}-item`,
              `${baseClassName}-item-min-plus-icon`,
              hashId,
            )}
          >
            <Dropdown
              menu={{
                items: insertOptions.map((t) => {
                  return {
                    label: (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        {t.icon}
                        {t.label?.at(0)}
                      </div>
                    ),
                    key: t.key,
                    onClick: () => {
                      insert(t);
                    },
                  };
                }),
              }}
            >
              <PlusCircleFilled />
            </Dropdown>
          </div>
          <Divider
            type="vertical"
            style={{
              margin: '0 4px',
              height: '18px',
              borderColor: 'rgba(0,0,0,0.15)',
            }}
            key={'divider'}
          />
          {headDom}
        </>
      );
    }, [insertOptions, props.min, node]);
    return (
      <div
        style={{
          display: 'flex',
          height: '100%',
          gap: '1px',
          alignItems: 'center',
        }}
      >
        {props.min ? minTools : listDom}

        {props.extra ? (
          <>
            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                height: '100%',
              }}
            >
              {props.extra?.map((item, index) => {
                if (React.isValidElement(item)) {
                  if (item.type === 'span') {
                    <div
                      className={classnames(`${baseClassName}-item`, hashId)}
                      key={index}
                    >
                      {item}
                    </div>;
                  }
                  return item;
                }
                return (
                  <div
                    className={classnames(`${baseClassName}-item`, hashId)}
                    key={index}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    );
  },
);
