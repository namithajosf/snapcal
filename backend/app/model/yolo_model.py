from fastapi import HTTPException
from ultralytics import YOLO
from typing import List  # Import List for type hinting

# Load the YOLO model once
model = YOLO("/home/namitha/code/main-project/snapcal/backend/app/model/runs/detect/train/weights/best.pt")
names = model.names  # ID to label mapping

def predict_food_from_image(image_path: str, conf_threshold: float = 0.5) -> list[str]:
    try:
        results = model(image_path)
        if not results or not results[0].boxes:
            raise Exception("No detected objects")

        detected_classes = set()

        for box in results[0].boxes:
            conf = float(box.conf.item())
            if conf < conf_threshold:
                continue

            cls_id = int(box.cls.item())
            class_name = names[cls_id]
            detected_classes.add(class_name)

        return list(detected_classes)
    except Exception as e:
        print(f"Error in post-processing: {e}")
        raise HTTPException(status_code=500, detail=f"Error in post-processing: {str(e)}")
