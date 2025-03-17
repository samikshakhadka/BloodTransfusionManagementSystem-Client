import { nepalJson } from './nepal';

interface Municipality {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
  municipalityList: Municipality[];
}

interface Province {
  id: number;
  name: string;
  districtList: District[];
}

export function getDistrictsByProvinceName(
  provinceName: string
): { id: number; name: string }[] {
  const province: Province | undefined = nepalJson.provinceList.find(
    (prov: Province) => prov.name.toLowerCase() === provinceName?.toLowerCase()
  );

  if (province) {
    const districtObjects: { id: number; name: string }[] =
      province.districtList.map((district) => ({
        id: district.id,
        name: district.name,
      }));
    return districtObjects.length > 0
      ? districtObjects
      : [{ id: 0, name: 'No districts found' }];
  } else {
    return [{ id: 0, name: 'No province found' }];
  }
}

export function getMunicipalitiesByDistrictName(
  districtName: string
): { id: number; name: string }[] {
  const foundMunicipalities: { id: number; name: string }[] = [];

  nepalJson.provinceList.forEach((province: Province) => {
    const district = province.districtList.find(
      (dist: District) => dist.name.toLowerCase() === districtName?.toLowerCase()
    );

    if (district) {
      foundMunicipalities.push(
        ...district.municipalityList.map((municipality) => ({
          id: municipality.id,
          name: municipality.name,
        }))
      );
    }
  });

  return foundMunicipalities.length > 0
    ? foundMunicipalities
    : [{ id: 0, name: 'No municipalities found' }];
}
