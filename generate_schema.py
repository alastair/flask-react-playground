import os
import subprocess
import tempfile

from pydantic import BaseModel

import app


if __name__ == '__main__':
    os.makedirs(os.path.join("static", "schema"), exist_ok=True)
    models = app.exported_model.all
    for m, obj in models.items():
        m: str
        obj: BaseModel
        print(f"Generating {m}...")
        schema_output = os.path.join("static", "schema", f"{m}.d.ts")
        with tempfile.NamedTemporaryFile(delete=False, suffix=".json", mode="w") as fp:
            fp.write(obj.schema_json())
        args = ["npm", "run", "json2ts", fp.name, schema_output]
        print(args)
        subprocess.run(args)
        os.unlink(fp.name)
