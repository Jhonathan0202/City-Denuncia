import { type DragEvent, type ChangeEvent, useState, useRef } from "react";
import * as Services from "../services/services";

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

type FormData = {
    category: string,
    title: string,
    description: string,
    location: Location | null,
    images: FileList | null,
}

export default function useHome() {
    const [isLoadingLocation, setisLoadingLocation] = useState<boolean>(false);
    const [isDroping, setIsDroping] = useState<boolean>(false);
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
