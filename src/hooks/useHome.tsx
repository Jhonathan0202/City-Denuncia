import { type DragEvent, type ChangeEvent, useState, useRef, type Dispatch, type SetStateAction } from "react";
import * as Services from "../services/services";
import type { TokensService } from "../types/User";
import type { Denuncia } from "../types/Denuncia";

type Location = {
    latitude: number,
    longitude: number,
    formated: string,
}

type FormErrors = {
    category?: string,
    title?: string,
    description?: string,
    location?: string,
    images?: string,
}

type ComplaintData = {
    category: string,
    title: string,
    description: string,
    location: Location | null,
    images: FileList | null,
}

type UseHomeProps = {
    tokens?: TokensService,
    setTokens: Dispatch<SetStateAction<TokensService | undefined>>
}

export default function useHome({ tokens, setTokens }: UseHomeProps) {
    const [isLoadingLocation, setisLoadingLocation] = useState<boolean>(false);
    const [isDroping, setIsDroping] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<FormErrors | null>(null);
    const [formData, setFormData] = useState<ComplaintData>({
        category: "",
        description: "",
        images: null,
        location: null,
        title: ""
    });
    const refFileInput = useRef<HTMLInputElement>(null);

    const handleSubmit = (): void => {
        if(validate()) {
            (async () => {
                if(tokens === undefined) return;
                if(!tokens.accessToken || !tokens.refreshToken) return;
                
                const body = new FormData();
                body.append("title", formData.title);
                body.append("category", formData.category);
                body.append("description", formData.description);
                body.append("address", formData.location?.formated ?? "");

                if (formData.images) {
                    Array.from(formData.images).forEach((image) => {
                        body.append("images", image);
                    });
                }

                const responseComplaint = await fetch("https://localhost:8080/complaints", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${tokens.accessToken}`
                    },
                    body: body
                });

                if(!responseComplaint.ok) {
                    const responseRefresh = await fetch("https://localhost:8080/refresh", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${tokens.refreshToken}`
                        },
                        body: JSON.stringify({
                            token: tokens.accessToken,
                            refreshToken: tokens.refreshToken
                        })
                    });

                    if(!responseRefresh.ok) {
                        console.error("Os tokens não foram gerados!");
                        return;
                    }

                    const dataTokens = await responseComplaint.json();
                    
                    const updatedTokens = {
                        accessToken: dataTokens.token ?? null,
                        refreshToken: dataTokens.refreshToken ?? null
                    };

                    setTokens(updatedTokens)

                    if(!updatedTokens.accessToken) {
                        console.error("Os tokens não foram gerados!");
                        return;
                    };

                    const responseRemake = await fetch("https://localhost:8080/complaints", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${updatedTokens.accessToken}`
                        },
                        body: body
                    });

                    if(!responseRemake.ok) {
                        console.error("Não foi possivel cadastrar sua denúncia!");
                    }
                }
                
            })();

            saveToLocalStorage();
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
        const newErrors: FormErrors = {};

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

    const saveToLocalStorage = (): void => {
        const id = `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        const novaDenuncia: Denuncia = {
            id,
            titulo: formData.title,
            categoria: formData.category as any,
            status: "Pendente",
            descricao: formData.description,
            endereco: formData.location?.formated,
            localizacao: formData.location?.formated,
            denunciante: "Anônimo",
            registradoEm: new Date().toLocaleString("pt-BR").replace(",", " às").substring(0,19)
        };

        const denunciasLocais = JSON.parse(localStorage.getItem("city-denuncia-denuncias") || "[]");
        denunciasLocais.push(novaDenuncia);
        localStorage.setItem("city-denuncia-denuncias", JSON.stringify(denunciasLocais));
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
        setisLoadingLocation(true);

        if(!("geolocation" in navigator)) {
            alert("Seu dispositivo não permite acessar sua localização");
            return;
        }

        const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
            }
        );

        const newLocalization = await Services.reverseGeolocation(position.coords.latitude, position.coords.longitude);

        setisLoadingLocation(false);

        handleChange("location", newLocalization);
    }

    const handleChange = <k extends keyof ComplaintData>(key: k, value: ComplaintData[k]) => {
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

    const dragAndDrop = (e: DragEvent<HTMLLabelElement>): void => {
        e.preventDefault();
        
        setIsDroping(false);

        if (!refFileInput.current) return;
        const dataTransfer: DataTransfer = new DataTransfer();
        
        Array.from(e.dataTransfer.files).forEach((file: File) => {
            dataTransfer.items.add(file);
        });

        if(refFileInput.current.files && refFileInput.current.files.length > 0) {
            Array.from(refFileInput.current.files).forEach((file: File) => {
                dataTransfer.items.add(file)
            });
        }

        if(validFiles(dataTransfer.files)) {
            refFileInput.current.files = dataTransfer.files;
            handleChange("images", refFileInput.current.files);
        } else {
            setFormErrors(prev => ({
                ...prev,
                images: "Apenas imagens JPEG, JPG e PNG são aceitas!"
            }))
        }
    }

    const addFile = (e: ChangeEvent<HTMLInputElement>) => {
        const dataTransfer: DataTransfer = new DataTransfer();

        if(validFiles(e.target.files)) {

            if(formData.images && formData.images.length > 0) {
                Array.from(formData.images).forEach((file: File) => {
                    dataTransfer.items.add(file)
                });
            }

            if(e.target.files && e.target.files.length) {
                Array.from(e.target.files).forEach((file: File) => {
                    dataTransfer.items.add(file)
                });
            }

            if(refFileInput.current) refFileInput.current.files = dataTransfer.files

            handleChange("images", dataTransfer.files);
        } else {
            setFormErrors(prev => ({
                ...prev,
                images: "Apenas imagens JPEG, JPG e PNG são aceitas!"
            }))
        }
    }

    return {
        isLoadingLocation,
        isDroping,
        formErrors,
        formData,
        refFileInput,
        handleSubmit,
        removeFile,
        getCurrentLocation,
        handleChange,
        handleChangeDropdown,
        dragAndDrop,
        setIsDroping,
        addFile
    }
}
