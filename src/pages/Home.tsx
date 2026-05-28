import { type JSX, useRef, useState } from "react";
import "../css/home.css";
import Dropdown from "../components/Dropdown";

type FormErrors = {
    category?: string,
    title?: string,
    description?: string,
    location?: string,
    images?: string,
}

type FormData = {
    category: string,
    title: string,
    description: string,
    location: Location | null,
    images: FileList | null,
}

type Location = {
    latitude: number,
    longitude: number,
    formated: string,
}

const Home = (): JSX.Element => {
    const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<FormErrors | null>(null);
    const [formData, setFormData] = useState<FormData>({
        category: "",
        description: "",
        images: null,
        location: null,
        title: ""
    });
    const refFileInput = useRef<HTMLInputElement>(null);

    const handleSubmit = (): void => {
        if(validate()) {
            Object.keys(formData).forEach((key) => {
                console.log(`${key}: ${formData[key as keyof FormData]}`)
            })
            
        } else {
            console.log("Inválido")
        }
        setFormData({
            category: "",
            description: "",
            images: null,
            location: null,
            title: ""
        });
        if (refFileInput.current) {
            refFileInput.current.value = "";
        }
    }

    const validate = (): boolean => {
        let newErrors: FormErrors = {};

        if(formData.category === "") {
            newErrors.category = "O campo de categoria é obrigatória!"
        }

        if(formData.title === "") {
            newErrors.title = "O campo de título é obrigatória!"
        }

        if(formData.description === "") {
            newErrors.description = "O campo de descrição é obrigatória!"
        }

        if(formData.location === null) {
            newErrors.location = "O campo de localização é obrigatória!"
        }

        if(!validFiles(formData.images)) {
            newErrors.images = "Apenas imagens JPEG, JPG e PNG são aceitas!"
        }

        setFormErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const validFiles = (files: FileList | null): boolean => {
        const validTypes: string[] = [
            "image/png",
            "image/jpg",
            "image/jpeg"
        ];

        if (!files || files.length === 0) {
            return true;
        }

        return Array.from(files).every((file: File) =>
            validTypes.includes(file.type)
        );
    }

    const removeFile = (index: number): void => {
        if(!formData.images || formData.images.length === 0) {
            return;
        }

        const filesArray = Array.from(formData.images);

        filesArray.splice(index, 1);

        const dataTransfer = new DataTransfer();

        filesArray.forEach((file) => {
            dataTransfer.items.add(file);
        });

        handleChange(
            "images",
            dataTransfer.files.length > 0
            ? dataTransfer.files
            : null
        );

        if (refFileInput.current) {
            refFileInput.current.files = dataTransfer.files;
        }
    }

    const getCurrentLocation = async (): Promise<void> => {
        if(!("geolocation" in navigator)) {
            alert("Seu dispositivo não permite acessar sua localização");
            return;
        }

        const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
            }
        );

        const request = await fetch(
            `https://api.tomtom.com/search/2/reverseGeocode/${position.coords.latitude},${position.coords.longitude}.json?key=${import.meta.env.VITE_MAPS_API_KEY}&radius=100&language=pt-BR`
        );

        const data = await request.json();

        const local =
            data.addresses[0]?.address?.freeformAddress ||
            `Latitude: ${position.coords.latitude} Longitude: ${position.coords.longitude}`;

        const newLocalization = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            formated: local
        };

        handleChange("location", newLocalization);
    }

    const handleChange = <k extends keyof FormData>(key: k, value: FormData[k]) => {
        setFormErrors(prev => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
        })
        setFormData(prev => ({
            ...prev,
            [key]:value
        }))
    }

    const handleChangeDropdown = (value: string): void => {
        handleChange("category", value)
    }

    return (
        <main>
            <form
                action={handleSubmit}//"/api/denuncia"
                aria-labelledby="h1-compliments-form"
                aria-describedby="p-compliments-form"
            >
                <div className="form-header">
                    <h2 id="h1-compliments-form">Nova Denúncia</h2>
                    <p id="p-compliments-form">
                        Registre problemas como buracos, esgoto, falta de iluminação e sinalização
                    </p>
                </div>
                <div className="form-body">
                    <div>
                        <label htmlFor="problem-category-control">
                            Categoria do Problema *
                        </label>
                        <Dropdown
                            id="problem-category"
                            value={formData.category}
                            onChange={handleChangeDropdown}
                            placeholder="selecione uma categoria"
                            options={[
                                { label: "Buraco na via", value: "buraco" },
                                { label: "Esgoto a céu aberto", value: "esgoto" },
                                { label: "Iluminação precária", value: "iluminação" },
                                { label: "Falta de sinalização", value: "sinalização" },
                                { label: "Acúmulo de lixo", value: "lixo" },
                                { label: "Calçada danificada", value: "calcada" },
                                { label: "Outros", value: "Outros" },
                            ]}
                        />
                        {
                            formErrors?.category && (
                                <p className="error-msg">{formErrors?.category}</p>
                            )
                        }
                    </div>
                    <div>
                        <label htmlFor="problem-title">
                            Título da Denúncia *
                        </label>
                        <input
                            type="text" name="problem-title" id="problem-title" placeholder="Digite o título da denúncia" value={formData.title} onChange={
                                (e) => handleChange("title", e.target.value)
                            }
                        />
                        {
                            formErrors?.title && (
                                <p className="error-msg">{formErrors?.title}</p>
                            )
                        }
                    </div>
                    <div>
                        <label htmlFor="problem-description">
                            Descrição Detalhada *
                        </label>
                        <textarea
                            name="problem-description" id="problem-description" placeholder="Descreva o problema em detalhes: localização específica, gravidade, há quanto tempo existe, riscos à população..." value={formData.description} onChange={
                                (e) => handleChange("description", e.target.value)
                            }
                        />
                        {
                            formErrors?.description && (
                                <p className="error-msg">{formErrors?.description}</p>
                            )
                        }
                    </div>
                    <div>
                        <label htmlFor="problem-location">
                            Localização *
                        </label>
                        <div className="location-inputs">
                            <button
                                type="button"
                                id="problem-location"
                                className="get-location"
                                disabled={loadingLocation}
                                onClick={ async () => {
                                    setLoadingLocation(true);

                                    try{
                                        await getCurrentLocation();
                                    } finally {
                                        setLoadingLocation(false);
                                    }
                                }}
                            >
                                {/* Ícone tirado do https://fonts.google.com/icons */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960"
                                >
                                    <path d="M536.5-503.5Q560-527 560-560t-23.5-56.5Q513-640 480-640t-56.5 23.5Q400-593 400-560t23.5 56.5Q447-480 480-480t56.5-23.5ZM480-80Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Z"/>
                                </svg>
                                Usar minha localização atual
                            </button>
                            {
                                formData.location && (
                                    <p className="location-result">{formData.location?.formated}</p>
                                )
                            }
                        </div>
                        {
                            formErrors?.location && (
                                <p className="error-msg">{formErrors?.location}</p>
                            )
                        }
                    </div>
                    <div>
                        <label aria-label="Foto(s) do problema" htmlFor="problem-images">
                            {/* Ícone tirado do https://fonts.google.com/icons */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                            >
                                <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
                            </svg>
                            Clique para adicionar uma foto
                            <span style={{ color: "var(--muted-text)"}}>PNG, JPG e JPEG até 10MB</span>
                        </label>
                        <input
                            type="file" name="problem-images" id="problem-images" accept=".png, .jpeg, .jpg" className="sr-only" aria-hidden="true" multiple ref={refFileInput} onChange={
                                (e) => {
                                    handleChange("images", e.target.files)
                                }
                            }
                        />
                        {
                            formErrors?.images && (
                                <p className="error-msg">{formErrors?.images}</p>
                            )
                        }
                        {
                            formData.images !== null && (
                                <ul className="files-selected">
                                    {
                                        Array.from(formData.images).map((file: File, index: number): JSX.Element => {
                                            return (
                                                <li className="file-item" key={index}>
                                                    {file.name}
                                                    <button
                                                        type="button"
                                                        aria-label="Remover arquivo adcionado"
                                                        onClick={() => removeFile(index)}
                                                    >
                                                        {/* Ícone tirado do https://fonts.google.com/icons */}
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 -960 960 960"
                                                        >
                                                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                                                        </svg>
                                                    </button>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            )
                        }
                    </div>
                    <button type="submit">
                        Enviar Denúncia
                    </button>
                </div>
            </form>
        </main>
    );
};
export default Home;
