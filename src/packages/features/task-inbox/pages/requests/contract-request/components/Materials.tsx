interface MaterialsProps {
  materials: material[];
}

type strap = {
  id: number;
  title: string;
  description: string;
};

type note = {
  id: number;
  title: string;
  description: string;
};

type material = {
  id: number;
  title: string;
  description: string;
  Straps: strap[];
  notes: note[];
};

export default function Materials({ materials }: MaterialsProps) {
  return (
    <>
      {materials.map((material, index) => (
        <div
          key={index}
          className="border border-primary-950/[.1] rounded-[16px] py-3 px-4 space-y-4"
        >
          <div className="flex flex-col space-y-3">
            <h4 className="font-semibold text-[20px]/[28px] text-primary-950">
              {material.title}
            </h4>
            <p className="font-medium text-[16px]/[30px] text-primary-950/[.5] max-w-[900px]">
              {material.description}
            </p>
          </div>

          {material.Straps &&
            material.Straps.map((strap, strapIndex) => (
              <div
                key={strapIndex}
                className="border border-primary-950/[.1] rounded-[16px] bg-secondary-50 px-4 py-3 space-y-[9.5px]"
              >
                <h4 className="font-semibold text-[20px]/[28px] text-primary-950">
                  {strap.title}
                </h4>
                <p className="font-medium text-[16px]/[30px] text-primary-950/[.5] max-w-[868px]">
                  {strap.description}
                </p>
              </div>
            ))}
          {material.notes &&
            material.notes.map((note, noteIndex) => (
              <div
                key={noteIndex}
                className="border border-primary-950/[.1] rounded-[16px] bg-secondary-50 px-4 py-3 space-y-[9.5px]"
              >
                <h4 className="font-semibold text-[20px]/[28px] text-primary-950">
                  {note.title}
                </h4>
                <p className="font-medium text-[16px]/[30px] text-primary-950/[.5] max-w-[868px]">
                  {note.description}
                </p>
              </div>
            ))}
        </div>
      ))}
    </>
  );
}
