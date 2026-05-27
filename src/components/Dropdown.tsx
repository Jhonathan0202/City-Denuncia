import { type JSX, useState } from "react";
import "../css/components/dropdown.css";

type Option = {
    value: string;
    label: string;
};

type DropdownProps = {
    options: Option[];
    id: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    disabled?: boolean;
};

const Dropdown = (props: DropdownProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDescendant, setActiveDescendant] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const select = (option: Option | null): void => {
        if(option) {
            props.onChange(option.value);
        }
        setIsOpen(false);
        setActiveDescendant(null);
        setActiveIndex(-1);
    }

    const hendleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
        const isNavKey: boolean = [
            "ArrowDown", "ArrowUp", "Up", "Down", "Home", "End"
        ].includes(e.key);
        const firstIndex: number = 0;
        const lastIndex: number = props.options.length - 1;

        const updateIndex = (index: number): void => {
            setActiveIndex(index);
            setActiveDescendant(`${props.options[index].value}-option`);
        }

        if(!isOpen) {
            if(isNavKey) {
                e.preventDefault();
                setIsOpen(true);
                if(["ArrowUp", "Up", "Home"].includes(e.key)) {
                    updateIndex(firstIndex);
                } else if(["End"].includes(e.key)) {
                    updateIndex(lastIndex);
                }
            }
            return;
        }

        switch(e.key) {
            case "ArrowUp":
            case "Up":
                e.preventDefault();
                if(e.altKey) {
                    select(props.options[activeIndex]);
                    break;
                }

                const prevIndex: number = activeIndex <= 0 ? 0 : activeIndex - 1;
                updateIndex(prevIndex);
                break;

            case "ArrowDown":
            case "Down":
                e.preventDefault();
                
                const nextIndex: number = activeIndex + 1 > lastIndex ? activeIndex : activeIndex + 1;
                updateIndex(nextIndex);
                
                break;

            case "Home":
            case "PageUp":
                e.preventDefault();
                updateIndex(firstIndex);
                break;

            case "End":
            case "PageDown":
                e.preventDefault();
                updateIndex(lastIndex);
                break;

            case "Enter":
            case " ":
                e.preventDefault();
                select(props.options[activeIndex]);
                break;

            case "Tab":
                select(props.options[activeIndex]);
                break;

            case "Escape":
            case "Esc":
                e.preventDefault();
                setIsOpen(false);
                setActiveDescendant(null);
                setActiveIndex(-1);
                break;

            default:
                break;
        }
    }

    return (
        <div className={`dropdown-container ${isOpen && "open"}`}>
            <input type="text" name={props.id} id={`${props.id}-input`} className="dropdown-input" value={props.value} onReset={() => {
                setIsOpen(false);
                setActiveDescendant(null);
                setActiveIndex(-1);
                props.onChange("");
                console.log("reset");
            }} />
            <button
                id={`${props.id}-control`}
                className={
                    `dropdown-control ${
                        (props.disabled || props.options.length === 0) && "disabled"
                    }`
                }
                type="button"
                role="combobox"
                aria-disabled={props.disabled || props.options.length === 0}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={`${props.id}-list`}
                aria-activedescendant={activeDescendant || undefined}
                aria-labelledby={`${props.id}-placeholder`}
                onClick={(e): void => {
                    e.preventDefault();
                    setIsOpen((prev: boolean): boolean => !prev);
                }}
                onKeyDown={hendleKeyDown}
            >
                <span
                    id={`${props.id}-placeholder`}
                    className={`dropdown-placeholder ${props.value != "" && "selected"}`}
                >
                    {
                        props.value != "" ?
                        props.options.find((o) => o.value === props.value)?.label :
                        (props.placeholder || "Selecione uma opção")
                    }
                </span>

                <div className="chevrons">
                    {
                        /* Ícones tirados de https://fonts.google.com/icons */
                        isOpen ?
                        (<svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="chevron chevron-up"
                        >
                            <path d="m256-424-56-56 280-280 280 280-56 56-224-223-224 223Z"/>
                        </svg>)
                        :
                        (<svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="chevron chevron-down"
                        >
                            <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/>
                        </svg>)
                    }
                </div>
            </button>

            <ul
                id={`${props.id}-list`}
                className={`dropdown-list ${isOpen && "open"}`}
                role="listbox"
                aria-labelledby={`${props.id}-placeholder`}
                tabIndex={-1}
                aria-multiselectable="false"
            >
                {
                    props.options.map((option: Option, index: number) => (
                        <li
                            key={option.value}
                            id={`${option.value}-option`}
                            className={
                                `item ${
                                    index === activeIndex && "focused"
                                } ${
                                    option.value === props.value && "active"
                                }`
                            }
                            role="option"
                            aria-selected={index === activeIndex}
                            onClick={(e): void => {
                                e.preventDefault();
                                select(option);
                            }}
                        >
                            {option.label}
                        </li>
                    ))
                }
            </ul>
            
        </div>
    );
};
export default Dropdown;
